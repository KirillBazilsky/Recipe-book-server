import express from "express";
import { getUser, updateUserRequest } from "../controllers/usersController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const usersRouter = express.Router();

usersRouter.get("/:userId", authMiddleware, getUser);
usersRouter.put("/:userId",  authMiddleware, updateUserRequest);

export default usersRouter;
