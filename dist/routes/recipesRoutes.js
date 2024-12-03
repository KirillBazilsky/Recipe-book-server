"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipesController_1 = require("../controllers/recipesController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRecipeId_1 = require("../middlewares/validateRecipeId");
const recipesRouter = express_1.default.Router();
recipesRouter.post("/", authMiddleware_1.authMiddleware, recipesController_1.addRecipe);
recipesRouter.put("/:recipeId", authMiddleware_1.authMiddleware, validateRecipeId_1.validateRecipeId, recipesController_1.updateRecipe);
recipesRouter.delete("/:recipeId", authMiddleware_1.authMiddleware, validateRecipeId_1.validateRecipeId, recipesController_1.deleteRecipe);
recipesRouter.get("/", recipesController_1.getRecipes);
recipesRouter.get("/:recipeId", recipesController_1.getRecipes);
exports.default = recipesRouter;
