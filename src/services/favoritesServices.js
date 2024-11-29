import { Favorite } from "../models/Favorites.js";

export const addRecipeToUserFavorites = async (
  userId,
  favoritesId,
  recipeId
) => {
  const existingFavorite =  await Favorite.findById(favoritesId);

  const updateFavoriteRecipes = () => {
    if (!existingFavorite) {
      return new Favorite({ userId, recipes: [recipeId] });
    }

    const recipeExists = existingFavorite.recipes
      .map((id) => id.toString())
      .includes(recipeId.toString());

    if (recipeExists) {
      throw new Error("Recipe already exists in favorites");
    }

    existingFavorite.recipes.push(recipeId);

    return existingFavorite;
  };

  const newFavorite = updateFavoriteRecipes();

  await newFavorite.save();

  return newFavorite;
};



export const removeRecipeFromUserFavorites = async (favoritesId, recipeId) => {
  const favorite = await Favorite.findById(favoritesId);

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

export const getUserFavoritesId = async (userId) => {
  const favorite = await Favorite.findOne({ userId });

  if(favorite){
    return favorite._id.toString();
  }
  
  return "";
};
