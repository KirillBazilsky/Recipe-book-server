import { ICookieOptions } from "../interfaces/cookieOption";

const ONE_HOUR = 3600000;

export const cookieOptions: ICookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ONE_HOUR, 
  };