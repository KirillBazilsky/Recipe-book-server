import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { isUserJwtPayload } from "../services/helpers";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(403).json({ message: "Access denied, token missing" });
  }

  try {
    const payload: JwtPayload | string| undefined = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET!, {}, (err: VerifyErrors | null, payload: JwtPayload | string | undefined) => {
        if (err) {
          reject(err);
        }

        resolve(payload);
      });
    });
    if(isUserJwtPayload(payload)) {
      req.user = {
        userId: payload.userId as string,
        name: payload.name as string,
        favoritesId: payload.favoritesId as string,
      };
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
