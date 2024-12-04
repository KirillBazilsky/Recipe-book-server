import mongoose, { Types } from "mongoose";
import { Favorite, IFavorite } from "../models/Favorites";
import { userMessages } from "../config/constants";

const updateFavoriteRecipes = (
  userId: string,
  recipeId: string,
  existingFavorite: IFavorite | null
): IFavorite => {
  if (!existingFavorite) {
    return new Favorite({ userId, recipes: [recipeId] });
  }
  const recipeExists: boolean = existingFavorite.recipes
    .map((id) => id.toString())
    .includes(recipeId.toString());

  if (recipeExists) {
    throw new Error(userMessages.duplicateFavorites);
  }

  existingFavorite.recipes.push(new Types.ObjectId(recipeId));

  return existingFavorite;
};

export const addRecipeToUserFavorites = async (
  userId: string,
  favoritesId: string,
  recipeId: string
): Promise<IFavorite> => {
  const existingFavorite: IFavorite | null = await Favorite.findById(
    favoritesId
  );

  const newFavorite: IFavorite = updateFavoriteRecipes(
    userId,
    recipeId,
    existingFavorite
  );

  await newFavorite.save();

  return newFavorite;
};

export const removeRecipeFromUserFavorites = async (
  favoritesId: string,
  recipeId: string
) => {
  const favorite: IFavorite | null = await Favorite.findById(favoritesId);

  if (!favorite) {
    throw new Error(userMessages.noFavorites);
  }

  try {
    await Favorite.updateOne(
      { _id: favoritesId },
      { $pull: { recipes: recipeId } }
    );

    return favorite;
  } catch (error: unknown) {
    throw error;
  }
};

export const getUserFavoriteRecipes = async (userId: string) => {
  const favorite = await Favorite.findOne({ userId }).populate("recipes");

  return favorite ? favorite.recipes : null;
};

export const getUserFavoritesId = async (userId: string) => {
  const favorite = await Favorite.findOne({ userId });

  if (favorite) {
    return favorite._id.toString();
  }

  return "";
};
