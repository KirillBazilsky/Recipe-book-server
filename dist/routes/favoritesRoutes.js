"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const favoritesController_1 = require("../controllers/favoritesController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const express_1 = __importDefault(require("express"));
const favoritesRouter = express_1.default.Router();
favoritesRouter.post("/", authMiddleware_1.authMiddleware, favoritesController_1.addRecipeToFavorites);
favoritesRouter.delete("/", authMiddleware_1.authMiddleware, favoritesController_1.removeRecipeFromFavorites);
favoritesRouter.get("/of/:userId", authMiddleware_1.authMiddleware, favoritesController_1.getUserFavorites);
exports.default = favoritesRouter;
