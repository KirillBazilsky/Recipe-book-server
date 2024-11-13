import express from "express";
import { updateUserController } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.put("/:userId", updateUserController);

export default usersRouter;
