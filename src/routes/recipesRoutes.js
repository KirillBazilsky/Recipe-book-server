import express from 'express';
import {
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipes,
} from "../controllers/recipesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRecipeId } from "../middlewares/validateRecipeId.js";

const recipesRouter = express.Router();

recipesRouter.post("/:userId", authMiddleware, addRecipe);

recipesRouter.put("/:userId", authMiddleware, validateRecipeId, updateRecipe);

recipesRouter.delete("/:userId", authMiddleware, validateRecipeId, deleteRecipe);

recipesRouter.get("/:userId", getRecipes);

export default recipesRouter;
