import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./src/routes/router.js";
import TokenService from "./src/services/tokenService.js";

dotenv.config();
export const tokenService = new TokenService(process.env.JWT_SECRET);

const app = express();
const port = process.env.PORT;

async function startServer() {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("Connected to MongoDB");

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
