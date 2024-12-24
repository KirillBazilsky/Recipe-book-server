import { IRecipe, Recipe } from "../models/Recipes";
import { mergeDefined } from "./helpers";
import { IFilters } from "../interfaces/filters";
import { userMessages } from "../config/constants";
import { ParsedQs } from "qs";
import { rename } from "fs/promises";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";

export const findRecipeById = async (id: string) => Recipe.findById(id);

export const createRecipe = async (recipeData: Partial<IRecipe>) => {
  const recipe: IRecipe = new Recipe(recipeData);

  await recipe.save();

  return recipe;
};

export const updateRecipeById = async (
  recipeId: string,
  updatedData: Partial<IRecipe>
) => {
  const recipe: IRecipe | null = await findRecipeById(recipeId);

  if (recipe) {
    const updatedRecipe: IRecipe = mergeDefined<IRecipe>(updatedData, recipe);
    Object.assign(recipe, updatedRecipe);

    await recipe.save();
  }

  return recipe;
};

export const deleteRecipeById = async (recipeId: string) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(recipeId);

    if (!recipe) {
      throw new Error(userMessages.recipeRemoved);
    }

    return recipe;
  } catch (error) {
    throw error;
  }
};

export const createFilter = ({
  userId,
  name,
  category,
  ingredients,
  creator,
  instructions,
}: IFilters): Record<string, any> => {
  const filter: Record<string, any> = {};

  if (userId) {
    filter["creator.id"] = userId;
  }
  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }
  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }
  if (ingredients) {
    filter.ingredients = { $elemMatch: { name: { $regex: ingredients } } };
  }
  if (instructions) {
    filter.instructions = { $regex: instructions, $options: "i" };
  }
  if (creator) {
    filter["creator.name"] = { $regex: creator, $options: "i" };
  }

  return filter;
};

export const findRecipes = async (
  filter: Record<string, any>,
  limit?: string | string[] | ParsedQs | ParsedQs[],
  page?: string | string[] | ParsedQs | ParsedQs[]
): Promise<{ recipes: IRecipe[] | []; count: number }> => {
  const parsedLimit = Math.max(1, Number(limit));
  const parsedPage = Math.max(1, Number(page));
  const count = await Recipe.countDocuments(filter);
  const recipes = await Recipe.find(filter)
    .limit(parsedLimit)
    .skip((parsedPage - 1) * parsedLimit);

  return { recipes, count };
};

export const checkUploadDirectoryExists = async (
  uploadDirectory: string
): Promise<boolean> => {
  try {
    await fs.access(uploadDirectory);

    return true;
  } catch (error) {
    return false;
  }
};

export const createUploadDirectory = async (
  uploadDirectory: string
): Promise<void> => {
  try {
    await fs.mkdir(uploadDirectory, { recursive: true });
    console.log(`Папка '${uploadDirectory}' была успешно создана.`);
  } catch (error) {
    console.error(`Ошибка при создании папки '${uploadDirectory}':`, error);
    throw new Error("Не удалось создать папку для загрузки");
  }
};

export const updateRecipeImage = async (
  recipeId: mongoose.Types.ObjectId | string,
  tempPath?: string,
  originalName?: string
): Promise<void> => {
  if (!tempPath || !originalName) {
    return;
  }

  const id = String(recipeId);
  const uploadDirectory = process.env.UPLOAD_DIR || "/tmp/uploads";

  try {
    if (!(await checkUploadDirectoryExists(uploadDirectory))) {
      await createUploadDirectory(uploadDirectory);
    }
    
    const newFileName = `${recipeId}${path.extname(originalName)}`;
    const newFilePath = path.join(path.dirname(tempPath), newFileName);

    console.log("Temp path:", tempPath);
    console.log("File extension:", path.extname(originalName));

    await rename(tempPath, newFilePath);

    await updateRecipeById(id, {
      image: newFileName,
    });
  } catch (error) {
    throw new Error();
  }
};
