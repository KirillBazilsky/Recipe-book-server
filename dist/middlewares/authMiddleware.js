"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("../services/helpers");
const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        res.status(403).json({ message: "Access denied, token missing" });
    }
    try {
        const payload = await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, {}, (err, payload) => {
                if (err) {
                    reject(err);
                }
                resolve(payload);
            });
        });
        if ((0, helpers_1.isUserJwtPayload)(payload)) {
            req.user = {
                userId: payload.userId,
                name: payload.name,
                favoritesId: payload.favoritesId,
            };
            next();
        }
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
