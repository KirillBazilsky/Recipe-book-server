"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRecipes = exports.buildFilter = exports.deleteRecipeById = exports.updateRecipeById = exports.createRecipe = exports.findRecipeById = void 0;
const Recipes_1 = require("../models/Recipes");
const helpers_1 = require("./helpers");
const findRecipeById = async (id) => Recipes_1.Recipe.findById(id);
exports.findRecipeById = findRecipeById;
const createRecipe = async (recipeData) => {
    const recipe = new Recipes_1.Recipe(recipeData);
    await recipe.save();
    return recipe;
};
exports.createRecipe = createRecipe;
const updateRecipeById = async (recipeId, updatedData) => {
    const recipe = await (0, exports.findRecipeById)(recipeId);
    if (recipe) {
        const updatedRecipe = (0, helpers_1.mergeDefined)(updatedData, recipe);
        Object.assign(recipe, updatedRecipe);
        await recipe.save();
    }
    return recipe;
};
exports.updateRecipeById = updateRecipeById;
const deleteRecipeById = async (recipeId) => {
    const recipe = await (0, exports.findRecipeById)(recipeId);
    if (recipe) {
        await recipe.deleteOne();
    }
    return recipe;
};
exports.deleteRecipeById = deleteRecipeById;
const buildFilter = ({ userId, name, category, ingredients, creator, instructions }) => {
    const filter = {};
    if (userId) {
        filter['creator.id'] = userId;
    }
    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }
    if (category) {
        filter.category = { $regex: category, $options: 'i' };
    }
    if (ingredients) {
        filter.ingredients = { $elemMatch: { name: { $regex: ingredients } } };
    }
    if (instructions) {
        filter.instructions = { $regex: instructions, $options: 'i' };
    }
    if (creator) {
        filter['creator.name'] = { $regex: creator, $options: 'i' };
    }
    return filter;
};
exports.buildFilter = buildFilter;
const findRecipes = async (filter) => Recipes_1.Recipe.find(filter);
exports.findRecipes = findRecipes;
