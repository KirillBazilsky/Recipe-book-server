import {
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  getUserFavorites,
} from "../controllers/favoritesController";
import { authMiddleware } from "../middlewares/authMiddleware";
import express from 'express';

const favoritesRouter = express.Router();

favoritesRouter.post("/", authMiddleware, addRecipeToFavorites);

favoritesRouter.delete("/", authMiddleware, removeRecipeFromFavorites);

favoritesRouter.get("/of/:userId", authMiddleware, getUserFavorites);

export default favoritesRouter;
