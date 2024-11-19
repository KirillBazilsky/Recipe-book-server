import {
  addRecipeToUserFavorites,
  removeRecipeFromUserFavorites,
  getUserFavoriteRecipes,
} from "../services/favoritesServices.js";

export const addRecipeToFavorites = async (req, res) => {
  try {
    const {favoritesId} = req.params;
    const { userId, recipeId } = req.body.data;

    await addRecipeToUserFavorites(favoritesId, userId, recipeId);

    res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeRecipeFromFavorites = async (req, res) => {
  try {
    const {favoritesId} = req.params;
    const { recipeId } = req.body.data;

    await removeRecipeFromUserFavorites(favoritesId, userId, recipeId);
    
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const recipes = await getUserFavoriteRecipes(userId);

    if (!recipes.length) {
      return res.status(404).json({ message: "User has no favorite recipes" });
    }

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
