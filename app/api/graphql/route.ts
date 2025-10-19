import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { resolvers, typeDefs } from "./schema";
import userMiddleware from "./modules/user/user.middleware";
import { configDotenv } from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
configDotenv();

export const config = {
  api: {
    bodyParser: false,
  }
};

export interface MyContext {
  req: NextApiRequest;
  res: NextApiResponse | undefined;
  user: { userId: number } | null;
};

function createNewTokens(userId: number) {
  const access_token = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
  const refresh_token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  return { access_token, refresh_token };
}

const server = new ApolloServer<MyContext>({ typeDefs, resolvers });
const startServer = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const request = req as NextApiRequest;
    const response = res as NextApiResponse | undefined;
    try {
      const auth = req.headers.cookie || "";
      const cookiesObj = Object.fromEntries(
        auth.split("; ").map(cookieStr => {
          const [key, ...value] = cookieStr.split("=");
          return [key, decodeURIComponent(value.join("="))];
        })
      );
      const accessToken = cookiesObj["access_token"] || "";
      const refreshToken = cookiesObj["refresh_token"] || "";
      if (accessToken || refreshToken) {
        const user = await userMiddleware(accessToken, refreshToken) as { userId: number; } | null;
        return { req: request, res: response, user } 
      };
      
      const cookieStore = await cookies();
      const access_token = cookieStore.get("access_token")?.value || "";
      const refresh_token = cookieStore.get("refresh_token")?.value || "";
      const user = await userMiddleware(access_token, refresh_token) as { userId: number; } | null;
      const newTokens = createNewTokens(user!.userId);
      if (!access_token) {
        cookieStore.set({
          secure: process.env.SECURE === "Product",
          name: "access_token",
          value: newTokens.access_token,
          sameSite: "lax",
          maxAge: 60 * 15,
        });
        cookieStore.set({
          secure: process.env.SECURE === "Product",
          name: "refresh_token",
          value: newTokens.refresh_token,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return { req: request, res: response, user };
    } catch(err) {
      console.error(err);
      return { req: request, res: response, user: null };
    }
  }
});

export const GET = startServer;
export const POST = startServer;