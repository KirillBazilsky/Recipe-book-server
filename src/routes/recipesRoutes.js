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

recipesRouter.post("/", authMiddleware, addRecipe);

recipesRouter.put("/:recipeId", authMiddleware, validateRecipeId, updateRecipe);

recipesRouter.delete("/:recipeId", authMiddleware, validateRecipeId, deleteRecipe);

recipesRouter.get("/", getRecipes);

export default recipesRouter;
