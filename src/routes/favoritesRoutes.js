import {
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  getUserFavorites,
} from "../controllers/favoritesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import express from 'express';

const favoritesRouter = express.Router();

favoritesRouter.post("/:favoritesId", authMiddleware, addRecipeToFavorites);

favoritesRouter.delete("/:favoritesId", authMiddleware, removeRecipeFromFavorites);

favoritesRouter.get("/of/:userId", authMiddleware, getUserFavorites);

export default favoritesRouter;
