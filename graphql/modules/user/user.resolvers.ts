import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/app/api/graphql/prisma";
import { cookies } from "next/headers";
import { MyContext } from "@/app/api/graphql/route";

const resolver =  {
  Query: {
    profile: async (_: unknown, __: unknown, context: MyContext) => {
      const { user } = context;
      console.log(user);
      try {
        if (!user) throw new Error("ابتدا وارد حساب کاربری خود شوید")
        const findUser = await prisma.user.findUnique({ where: { id: user.userId } })
        if (!findUser) {
          throw new Error("مشکلی پیش آمد !!");
        }

        return {
          id: findUser.id,
          phone_number: findUser.phone_number,
          createdAt: findUser.createdAt,
        };
      } catch(err) {
        console.error(err);
        return {
          id: null,
          phone_number: null,
          createdAt: null,
        }
      }
    },
  },

  Mutation: {

    register: async (_: unknown, { phone_number, password }: { phone_number: string; password: string }) => {
      try {
        const findUser = await prisma.user.findUnique({ where: { phone_number } });
        if (findUser)
          throw new Error("شما قبلا ثبت نام کرده اید");

        const hash = await bcrypt.hash(password, 10);
        if (!hash)
          throw new Error("هنگام هش کردن رمز سرور به مشکل برخورد کرد");
        const user = await prisma.user.create({
          data: {
            phone_number,
            password: hash,
          }
        });

        if (!user)
          throw new Error("هنگام ثبت نام مشکلی پیش آمده است");
        
        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },

    login: async (_: unknown, { phone_number, password }: { phone_number: string; password: string }) => {
      try {
        if (!phone_number) throw new Error("شماره همراه را وارد کنید");

        const user = await prisma.user.findUnique({ where: { phone_number } });
        if (!user) throw new Error("کاربری با این شماره همراه یافت نشد");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("رمز عبور اشتباه است");

        const access_token = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
        const refresh_token = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
        const cookieStore = await cookies();

        cookieStore.set({
          secure: process.env.SECURE === "Product",
          name: "access_token",
          value: access_token,
          sameSite: "lax",
          maxAge: 60 * 15,
          path: "/",
          httpOnly: true,
        });

        cookieStore.set({
          secure: process.env.SECURE === "Product",
          name: "refresh_token",
          value: refresh_token,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          httpOnly: true,
        });

        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },
  }
}

export default resolver;