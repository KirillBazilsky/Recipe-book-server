"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./types/express");
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = __importDefault(require("./routes/router"));
const tokenService_1 = __importDefault(require("./services/tokenService"));
dotenv_1.default.config();
exports.tokenService = new tokenService_1.default(process.env.JWT_SECRET);
const app = (0, express_1.default)();
const port = process.env.PORT || "3000";
async function startServer() {
    try {
        const dbUrl = process.env.DB_URL || "";
        if (!dbUrl) {
            throw new Error("Database URL is not defined in environment variables");
        }
        await mongoose_1.default.connect(dbUrl);
        console.log("Connected to MongoDB");
        app.use((0, cors_1.default)({
            origin: process.env.CLIENT_ORIGIN,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        app.use(body_parser_1.default.json());
        app.use((0, cookie_parser_1.default)());
        app.use("/api", router_1.default);
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
startServer();
