import { IRecipe, Recipe } from '../models/Recipes';
import { mergeDefined } from './helpers';
import { IFilters } from '../interfaces/filters';

export const findRecipeById = async (id: string) => Recipe.findById(id);

export const createRecipe = async (recipeData: Partial<IRecipe>) => {
  const recipe: IRecipe = new Recipe(recipeData);

  await recipe.save();

  return recipe;
};

export const updateRecipeById = async (recipeId: string, updatedData: Partial<IRecipe>) => {
  const recipe: IRecipe | null = await findRecipeById(recipeId);

  if (recipe) {

    const updatedRecipe: IRecipe = mergeDefined<IRecipe>(updatedData,recipe)

    Object.assign(recipe, updatedRecipe);
    await recipe.save();
  }

  return recipe;
};

export const deleteRecipeById = async (recipeId: string) => {
  const recipe = await findRecipeById(recipeId);

  if (recipe) {
    await recipe.deleteOne();
  }

  return recipe;
};

export const buildFilter = ({
  userId,
  name,
  category,
  ingredients,
  creator,
  instructions
}: IFilters): Record<string, any> => { 
  const filter: { [key: string]: any } = {};
  
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
  

export const findRecipes = async (filter: Record<string, any>): Promise<IRecipe[] | []> => Recipe.find(filter);
