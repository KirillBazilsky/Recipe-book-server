"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    secret;
    expiresIn;
    constructor(secret, expiresIn = "1h") {
        this.secret = secret;
        this.expiresIn = expiresIn;
    }
    generateToken(payload) {
        if (!this.secret) {
            throw new Error("Missing process.env.JWT_SECRET");
        }
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }
    verifyToken(token) {
        try {
            if (!this.secret) {
                throw new Error("Missing process.env.JWT_SECRET");
            }
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (error) {
            throw new Error("Invalid token");
        }
    }
}
exports.default = TokenService;
