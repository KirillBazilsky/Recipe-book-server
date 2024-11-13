import { Favorite } from "../models/Favorites.js";

export const findUserFavorites = async (userId) => {
  return await Favorite.findOne({ userId });
};

export const addRecipeToUserFavorites = async (userId, recipeId) => {
  const existingFavorite = await findUserFavorites(userId);

  const updateFavoriteRecipes = () => {
    if (!existingFavorite) {
      return new Favorite({ userId, recipes: [recipeId] });
    }

    existingFavorite.recipes = Array.from(new Set([...existingFavorite.recipes, recipeId]))

    return existingFavorite
  };

  const newFavorite =
    updateFavoriteRecipes();

  await newFavorite.save();

  return newFavorite;
};

export const removeRecipeFromUserFavorites = async (userId, recipeId) => {
  const favorite = await findUserFavorites(userId);

  if (!favorite) {
    throw new Error("User has no favorite recipes");
  }

  favorite.recipes = favorite.recipes.filter(
    (id) => id.toString() !== recipeId
  );
  
  await favorite.save();

  return favorite;
};

export const getUserFavoriteRecipes = async (userId) => {
  const favorite = await Favorite.findOne({ userId }).populate("recipes");

  return favorite ? favorite.recipes : null;
};
