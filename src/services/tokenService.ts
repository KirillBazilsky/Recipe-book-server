import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "src/models/Users";

class TokenService {
  private secret: string | undefined;
  private expiresIn: string;

  constructor(secret: string | undefined, expiresIn: string = "1h") {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generateToken(user: IUser): string {
    if(!this.secret) {
      throw new Error("Missing process.env.JWT_SECRET");
    }

    const {_id: userId, name, favoritesId} = user;
    const payload = {
      userId,
      name,
      favoritesId
    }

    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): JwtPayload | string {
    try {
      if(!this.secret) {
        throw new Error("Missing process.env.JWT_SECRET");
      }

      return jwt.verify(token, this.secret) ; 
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export default TokenService;
