import jwt from "jsonwebtoken";

export default async function userMiddleware(access_token: string, refresh_token: string) {
  try {
    if (access_token) return jwt.verify(access_token, process.env.JWT_ACCESS_SECRET!) as { userId: number };
    if (!refresh_token)
      throw new Error("توکن معتبر نیست لطفا دوباره وارد حساب کاربری خود شوید");
    return jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET!) as { userId: number };
  } catch(err) {
    console.error(err);
    return {};
  }
}