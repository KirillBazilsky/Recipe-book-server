import {
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  getUserFavorites,
} from "../controllers/favoritesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import express from 'express';

const favoritesRouter = express.Router();

favoritesRouter.post("/:userId", authMiddleware, addRecipeToFavorites);

favoritesRouter.delete("/:userId", authMiddleware, removeRecipeFromFavorites);

favoritesRouter.get("/:userId", authMiddleware, getUserFavorites);

export default favoritesRouter;
