const ONE_HOUR = 3600000;

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: ONE_HOUR, 
  };