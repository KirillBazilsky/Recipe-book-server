import { Response, Request } from "express";
import { Error, MongooseError } from "mongoose";
import { ParsedQs } from "qs";
import { Recipe } from "../models/Recipes";
import {
  buildFilter,
  createRecipe,
  deleteRecipeById,
  findRecipeById,
  findRecipes,
  updateRecipeById,
} from "../services/recipeServices";

export const addRecipe = async (req: Request, res: Response) => {
  try {
    const { name, ingredients, instructions, category } = req.body.data;

    const { userId, name: userName } = req.user;

    if (!userId) {
      res.status(404).json({ message: "User not found" });
    }

    const creator = {
      name: userName,
      id: userId,
    };

    const recipe = await createRecipe({
      name,
      ingredients,
      instructions,
      category,
      creator,
    });

    res.status(201).json(recipe);
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({ message: "Recipe with this name already exists" });
      }

      res.status(500).json({ error: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const { userId } = req.user;
    const { name, ingredients, instructions, category } = req.body.data;

    const existingRecipe = await Recipe.findById(recipeId);

    if (!existingRecipe) {
      res.status(404).json({ error: "Recipe not found" });
    } 
    
    else if (existingRecipe.creator?.id !== userId) {
      res.status(404).json({ error: "Access denied" });
    }

    const updatedData = { name, ingredients, instructions, category };
    const recipe = await updateRecipeById(recipeId, updatedData);

    res.status(201).json(recipe);
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({ message: "Recipe with this name already exists" });
      }
      res.status(500).json({ error: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const { userId } = req.user;
    const existingRecipe = await Recipe.findById(recipeId);

    if (!existingRecipe) {
      res.status(404).json({ error: "Recipe not found" });
    }
    else if (existingRecipe.creator?.id !== userId) {
      res.status(404).json({ error: "Access denied" });
    }

    if (!recipeId) {
      res.status(400).json({ error: "Recipe ID is required" });
    }

    const recipe = await deleteRecipeById(recipeId);

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      res.status(500).json({ error: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};

export const getRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, category, ingredients, instructions, creator } =
      req.query;

    const toString = (
      value: ParsedQs | string | string[] | ParsedQs[] | undefined
    ): string | undefined => (typeof value === "string" ? value : undefined);

    const filter = buildFilter({
      userId: toString(userId),
      name: toString(name),
      category: toString(category),
      ingredients: toString(ingredients),
      instructions: toString(instructions),
      creator: toString(creator),
    });

    const recipes = await findRecipes(filter);

    res.status(200).json(recipes.length ? { recipes } : { recipes: [] });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const recipe = await findRecipeById(recipeId);

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ recipe });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};
