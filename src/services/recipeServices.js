import { Recipe } from '../models/Recipes.js';
import { mergeDefined } from './helpers.js';

export const findRecipeById = async (id) => Recipe.findById(id);

export const createRecipe = async (recipeData) => {
  const recipe = new Recipe(recipeData);

  await recipe.save();

  return recipe;
};

export const updateRecipeById = async (recipeId, updatedData) => {
  const recipe = await findRecipeById(recipeId);

  if (recipe) {

    const updatedRecipe = mergeDefined(updatedData,recipe._doc)

    Object.assign(recipe, updatedRecipe);
    await recipe.save();
  }

  return recipe;
};

export const deleteRecipeById = async (recipeId) => {
  const recipe = await findRecipeById(recipeId);

  if (recipe) {
    await recipe.deleteOne();
  }

  return recipe;
};

export const buildFilter = ({ userId, name, category, ingredients, creator, instructions }) => {
    const filter = {};
  
    if (userId) {
      filter['creator.id'] = userId;
    }
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (ingredients) {
      filter.ingredients = { $elemMatch: { name: { $regex: ingredients } } };
    }
    if (instructions) {
      filter.instructions = { $regex: instructions, $options: 'i' };
    }
    if (creator) {
      filter['creator.name'] = { $regex: creator, $options: 'i' };
    }
  
    return filter;
  };
  

export const findRecipes = async (filter) => Recipe.find(filter);
