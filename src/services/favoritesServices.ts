import mongoose from "mongoose";
import { Favorite, IFavorite } from "../models/Favorites";

export const addRecipeToUserFavorites = async (
  userId: string,
  favoritesId: string,
  recipeId: mongoose.Types.ObjectId
): Promise<IFavorite> => {
  const existingFavorite: IFavorite | null = await Favorite.findById(
    favoritesId
  );

  const updateFavoriteRecipes = () => {
    if (!existingFavorite) {
      return new Favorite({ userId, recipes: [recipeId] });
    }

    const recipeExists: boolean = existingFavorite.recipes
      .map((id) => id.toString())
      .includes(recipeId.toString());

    if (recipeExists) {
      throw new Error("Recipe already exists in favorites");
    }

    existingFavorite.recipes.push(recipeId);

    return existingFavorite;
  };

  const newFavorite: IFavorite = updateFavoriteRecipes();

  await newFavorite.save();

  return newFavorite;
};

export const removeRecipeFromUserFavorites = async (
  favoritesId: string,
  recipeId: string
) => {
  const favorite: IFavorite | null = await Favorite.findById(favoritesId);

  if (!favorite) {
    throw new Error("User has no favorite recipes");
  }

  try {
    await Favorite.updateOne(
      { _id: favoritesId },
      { $pull: { recipes: recipeId } }
    );
    
    return favorite;
  } catch (error: unknown) {
    throw  error;
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
