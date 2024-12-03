"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavorites = exports.removeRecipeFromFavorites = exports.addRecipeToFavorites = void 0;
const favoritesServices_1 = require("../services/favoritesServices");
const mongoose_1 = require("mongoose");
const addRecipeToFavorites = async (req, res) => {
    try {
        const { userId, favoritesId } = req.user;
        const { recipeId } = req.body.data;
        await (0, favoritesServices_1.addRecipeToUserFavorites)(userId, favoritesId, recipeId);
        res.status(200).json({ message: "Recipe added to favorites" });
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.addRecipeToFavorites = addRecipeToFavorites;
const removeRecipeFromFavorites = async (req, res) => {
    try {
        const { favoritesId } = req.user;
        const { recipeId } = req.body;
        await (0, favoritesServices_1.removeRecipeFromUserFavorites)(favoritesId, recipeId);
        res.status(200).json({ message: "Recipe removed from favorites" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.removeRecipeFromFavorites = removeRecipeFromFavorites;
const getUserFavorites = async (req, res) => {
    try {
        const { userId } = req.user;
        const recipes = await (0, favoritesServices_1.getUserFavoriteRecipes)(userId);
        res.status(200).json(recipes ?? []);
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.getUserFavorites = getUserFavorites;
