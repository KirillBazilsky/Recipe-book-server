import { loginUser, registerUser } from "../controllers/authController";
import express from "express";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

export default authRouter;
