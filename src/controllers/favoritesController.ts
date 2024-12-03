import { JwtPayload } from "jsonwebtoken";
import {
  addRecipeToUserFavorites,
  removeRecipeFromUserFavorites,
  getUserFavoriteRecipes,
} from "../services/favoritesServices";
import { Response, Request } from "express";
import { MongooseError } from "mongoose";

export const addRecipeToFavorites = async (req: Request, res: Response) => {
  try {
    const { userId, favoritesId } = req.user as JwtPayload;
    const { recipeId } = req.body.data;

    await addRecipeToUserFavorites(userId, favoritesId, recipeId);

    res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    if (error instanceof MongooseError) {
      res.status(500).json({ error: error.message });
    }

     res.status(500).json({ message: "Unknown error occurred" });
  }
};

export const removeRecipeFromFavorites = async (
  req: Request,
  res: Response
) => {
  try {
    const { favoritesId } = req.user as JwtPayload;
    const { recipeId } = req.body;

    await removeRecipeFromUserFavorites(favoritesId, recipeId);

    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};

export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as JwtPayload;
    const recipes = await getUserFavoriteRecipes(userId);

    res.status(200).json(recipes ?? []);
  } catch (error) {
    if (error instanceof MongooseError) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ message: "Unknown error occurred" });
  }
};
