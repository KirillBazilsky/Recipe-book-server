import { Response, Request } from "express";
import { Recipe } from "../models/Recipes";
import {
  createFilter,
  createRecipe,
  deleteRecipeById,
  findRecipeById,
  findRecipes,
  updateRecipeById,
} from "../services/recipeServices";
import { errorHandler, toString } from "../services/helpers";
import { userMessages } from "../config/constants";

export const addRecipe = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, ingredients, instructions, category } = req.body.data;
    const { userId, name: userName } = req.user;

    if (!userId) {
      return res.status(404).json({ message: userMessages.userNotFound });
    }

    const recipe = await createRecipe({
      name,
      ingredients,
      instructions,
      category,
      creator: {
        name: userName,
        id: userId,
      },
    });

    return res.status(201).json(recipe);
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { recipeId } = req.params;
    const { userId } = req.user;
    const { name, ingredients, instructions, category } = req.body.data;

    const existingRecipe = await Recipe.findById(recipeId);

    if (!existingRecipe) {
      return res.status(404).json({ error: userMessages.recipeNotFound });
    }

    if (existingRecipe.creator?.id !== userId) {
      return res.status(404).json({ error: userMessages.validationError });
    }

    const recipe = await updateRecipeById(recipeId, {
      name,
      ingredients,
      instructions,
      category,
    });

    return res.status(201).json(recipe);
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { recipeId } = req.params;
    const { userId } = req.user;
    const existingRecipe = await Recipe.findById(recipeId);

    if (!existingRecipe) {
      return res.status(404).json({ error: userMessages.recipeNotFound });
    }

    if (existingRecipe.creator?.id !== userId) {
      return res.status(404).json({ error: userMessages.validationError });
    }

    if (!recipeId) {
      return res.status(400).json({ error: userMessages.idRequired });
    }

    await deleteRecipeById(recipeId);

    return res.status(200).json({ message: userMessages.recipeRemoved });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};

export const getRecipes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      userId,
      name,
      category,
      ingredients,
      instructions,
      creator,
      limit,
      page,
    } = req.query;
    const filter = createFilter({
      userId: toString(userId),
      name: toString(name),
      category: toString(category),
      ingredients: toString(ingredients),
      instructions: toString(instructions),
      creator: toString(creator),
    });
    const { recipes, count } = await findRecipes(
      filter,
      toString(limit),
      toString(page)
    );

    return res.status(200).json({ recipes, count });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};

export const getRecipe = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { recipeId } = req.params;
    const recipe = await findRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: userMessages.notFound });
    }

    return res.status(200).json({ recipe });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};
