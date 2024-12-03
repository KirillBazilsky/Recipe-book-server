"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavoritesId = exports.getUserFavoriteRecipes = exports.removeRecipeFromUserFavorites = exports.addRecipeToUserFavorites = void 0;
const Favorites_1 = require("../models/Favorites");
const addRecipeToUserFavorites = async (userId, favoritesId, recipeId) => {
    const existingFavorite = await Favorites_1.Favorite.findById(favoritesId);
    const updateFavoriteRecipes = () => {
        if (!existingFavorite) {
            return new Favorites_1.Favorite({ userId, recipes: [recipeId] });
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
exports.addRecipeToUserFavorites = addRecipeToUserFavorites;
const removeRecipeFromUserFavorites = async (favoritesId, recipeId) => {
    const favorite = await Favorites_1.Favorite.findById(favoritesId);
    if (!favorite) {
        throw new Error("User has no favorite recipes");
    }
    favorite.recipes = favorite.recipes.filter((favorite) => favorite._id.toString() !== recipeId);
    await favorite.save();
    return favorite;
};
exports.removeRecipeFromUserFavorites = removeRecipeFromUserFavorites;
const getUserFavoriteRecipes = async (userId) => {
    const favorite = await Favorites_1.Favorite.findOne({ userId }).populate("recipes");
    return favorite ? favorite.recipes : null;
};
exports.getUserFavoriteRecipes = getUserFavoriteRecipes;
const getUserFavoritesId = async (userId) => {
    const favorite = await Favorites_1.Favorite.findOne({ userId });
    if (favorite) {
        return favorite._id.toString();
    }
    return "";
};
exports.getUserFavoritesId = getUserFavoritesId;
