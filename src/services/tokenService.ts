import jwt, { JwtPayload } from "jsonwebtoken";

class TokenService {
  private secret: string | undefined;
  private expiresIn: string;

  constructor(secret: string | undefined, expiresIn: string = "1h") {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generateToken(payload: Record<string, any>): string {
    if(!this.secret) {
      throw new Error("Missing process.env.JWT_SECRET");
    }

    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): JwtPayload | string {
    try {
      if(!this.secret) {
        throw new Error("Missing process.env.JWT_SECRET");
      }

      return jwt.verify(token, this.secret) as JwtPayload; 
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export default TokenService;
