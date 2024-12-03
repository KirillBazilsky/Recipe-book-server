import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/router";
import TokenService from "./services/tokenService";

dotenv.config();

export const tokenService = new TokenService(process.env.JWT_SECRET);

const app = express();
const port: string = process.env.PORT || "3000";

async function startServer() {
  try {

    const dbUrl: string = process.env.DB_URL || "";

    if (!dbUrl) {
      throw new Error("Database URL is not defined in environment variables");
    }

    await mongoose.connect(dbUrl);

    console.log("Connected to MongoDB");

    app.use(
      cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use("/api", router);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
