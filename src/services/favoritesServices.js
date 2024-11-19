import { Favorite } from "../models/Favorites.js";

export const findFavoritesById = async (favoritesId) => {
  return Favorite.findById({ favoritesId });
};

export const addRecipeToUserFavorites = async (favoritesId, userId, recipeId) => {
  const existingFavorite = await findFavoritesById(favoritesId);

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

export const removeRecipeFromUserFavorites = async (favoritesId, recipeId) => {
  const favorite = await findFavoritesById(favoritesId);

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
