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
import { uploadMiddleware } from "../middlewares/uploadMiddleware";

const recipesRouter = express.Router();

recipesRouter.post("/", authMiddleware, uploadMiddleware, addRecipe);

recipesRouter.put("/:recipeId", authMiddleware, validateRecipeId, uploadMiddleware, updateRecipe);

recipesRouter.delete("/:recipeId", authMiddleware, validateRecipeId, deleteRecipe);

recipesRouter.get("/", getRecipes);

recipesRouter.get("/:recipeId", getRecipe);

export default recipesRouter;