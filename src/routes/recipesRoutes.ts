import express from 'express';
import {
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipes,
  getRecipe,
} from "../controllers/recipesController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRecipeId } from "../middlewares/validateRecipeId";

const recipesRouter = express.Router();

recipesRouter.post("/", authMiddleware, addRecipe);

recipesRouter.put("/:recipeId", authMiddleware, validateRecipeId, updateRecipe);

recipesRouter.delete("/:recipeId", authMiddleware, validateRecipeId, deleteRecipe);

recipesRouter.get("/", getRecipes);

recipesRouter.get("/:recipeId", getRecipe);

export default recipesRouter;