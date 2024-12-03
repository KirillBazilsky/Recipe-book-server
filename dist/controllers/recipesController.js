"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipe = exports.getRecipes = exports.deleteRecipe = exports.updateRecipe = exports.addRecipe = void 0;
const mongoose_1 = require("mongoose");
const Recipes_1 = require("../models/Recipes");
const helpers_1 = require("../services/helpers");
const recipeServices_1 = require("../services/recipeServices");
const addRecipe = async (req, res) => {
    try {
        const { name, ingredients, instructions, category } = req.body.data;
        const { userId, name: userName } = req.user;
        if (!userId) {
            res.status(404).json({ message: "User not found" });
        }
        const creator = {
            name: userName,
            id: userId,
        };
        const recipe = await (0, recipeServices_1.createRecipe)({
            name,
            ingredients,
            instructions,
            category,
            creator,
        });
        res.status(201).json(recipe);
    }
    catch (error) {
        if ((0, helpers_1.isMongoError)(error)) {
            if (error.code === 11000) {
                res
                    .status(400)
                    .json({ message: "Recipe with this name already exists" });
            }
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.addRecipe = addRecipe;
const updateRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { userId } = req.user;
        const { name, ingredients, instructions, category } = req.body.data;
        const existingRecipe = await Recipes_1.Recipe.findById(recipeId);
        if (!existingRecipe) {
            res.status(404).json({ error: "Recipe not found" });
        }
        else if (existingRecipe.creator?.id !== userId) {
            res.status(404).json({ error: "Access denied" });
        }
        const updatedData = { name, ingredients, instructions, category };
        const recipe = await (0, recipeServices_1.updateRecipeById)(recipeId, updatedData);
        res.status(201).json(recipe);
    }
    catch (error) {
        if ((0, helpers_1.isMongoError)(error)) {
            if (error.code === 11000) {
                res
                    .status(400)
                    .json({ message: "Recipe with this name already exists" });
            }
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.updateRecipe = updateRecipe;
const deleteRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { userId } = req.user;
        const existingRecipe = await Recipes_1.Recipe.findById(recipeId);
        if (!existingRecipe) {
            res.status(404).json({ error: "Recipe not found" });
        }
        else if (existingRecipe.creator?.id !== userId) {
            res.status(404).json({ error: "Access denied" });
        }
        if (!recipeId) {
            res.status(400).json({ error: "Recipe ID is required" });
        }
        const recipe = await (0, recipeServices_1.deleteRecipeById)(recipeId);
        if (!recipe) {
            res.status(404).json({ error: "Recipe not found" });
        }
        res.status(200).json({ message: "Recipe deleted successfully" });
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.deleteRecipe = deleteRecipe;
const getRecipes = async (req, res) => {
    try {
        const { userId, name, category, ingredients, instructions, creator } = req.query;
        const toString = (value) => (typeof value === "string" ? value : undefined);
        const filter = (0, recipeServices_1.buildFilter)({
            userId: toString(userId),
            name: toString(name),
            category: toString(category),
            ingredients: toString(ingredients),
            instructions: toString(instructions),
            creator: toString(creator),
        });
        const recipes = await (0, recipeServices_1.findRecipes)(filter);
        res.status(200).json(recipes.length ? { recipes } : { recipes: [] });
    }
    catch (error) {
        if (error instanceof mongoose_1.Error) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.getRecipes = getRecipes;
const getRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const recipe = await (0, recipeServices_1.findRecipeById)(recipeId);
        if (!recipe) {
            res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json({ recipe });
    }
    catch (error) {
        if (error instanceof mongoose_1.Error) {
            res.status(500).json({ error: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.getRecipe = getRecipe;
