import express from "express";
import { getUser, updateUserRequest } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/:userId", getUser);
usersRouter.put("/:userId", updateUserRequest);

export default usersRouter;
