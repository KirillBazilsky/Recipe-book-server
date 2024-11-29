import { Recipe } from "../models/Recipes.js";
import {
  createRecipe,
  updateRecipeById,
  deleteRecipeById,
  findRecipes,
  buildFilter,
  findRecipeById,
} from "../services/recipeServices.js";

export const addRecipe = async (req, res) => {
  try {
    const { name, ingredients, instructions, category } = req.body.data;

    const { userId, name: userName} = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const creator = {
      name: userName,
      id: userId
    }

    const recipe = await createRecipe({
      name,
      ingredients,
      instructions,
      category,
      creator,
    });

    res.status(201).json(recipe);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Recipe with this name already exists" });
    }
    
    res.status(500).json({ error: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const {recipeId} = req.params;
    const {userId} = req.user;
    const { name, ingredients, instructions, category } = req.body.data;

    const existingRecipe = Recipe.findById(recipeId);

    if (existingRecipe.creator.id !== userId) {
      return res.status(404).json({ error: "Access denied" });
    }

    const updatedData = { name, ingredients, instructions, category };
    const recipe = await updateRecipeById(recipeId, updatedData);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(201).json(recipe);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Recipe with this name already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const {userId} = req.user;
    const existingRecipe = await Recipe.findById(recipeId);

    if (existingRecipe.creator.id !== userId) {
      return res.status(404).json({ error: "Access denied" });
    }

    if (!recipeId) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    const recipe = await deleteRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const { userId, name, category, ingredients, instructions, creator } = req.query;
    const filter = buildFilter({ userId, name, category, ingredients, instructions, creator  });
    const recipes = await findRecipes(filter);

    if (!recipes.length) {
      return res.status(404).json({ message: "No recipes found" });
    }

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await findRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "No recipe found" });
    }

    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
