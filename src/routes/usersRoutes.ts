import express from "express";
import { getUser, updateUserRequest } from "../controllers/usersController";
import { authMiddleware } from "../middlewares/authMiddleware";

const usersRouter = express.Router();

usersRouter.get("/:userId", authMiddleware, getUser);
usersRouter.put("/:userId",  authMiddleware, updateUserRequest);

export default usersRouter;
