import {
  addRecipeToUserFavorites,
  removeRecipeFromUserFavorites,
  getUserFavoriteRecipes,
} from "../services/favoritesServices";
import { Response, Request } from "express";
import { errorHandler } from "../services/helpers";

export const addRecipeToFavorites = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, favoritesId } = req.user;
    const { recipeId } = req.body.data;
    

    await addRecipeToUserFavorites(userId, favoritesId, recipeId);

    return res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};

export const removeRecipeFromFavorites = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { favoritesId } = req.user;
    const { recipeId } = req.body;

    await removeRecipeFromUserFavorites(favoritesId, recipeId);

    return res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};

export const getUserFavorites = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.user;
    const recipes = await getUserFavoriteRecipes(userId);

    return res.status(200).json(recipes ?? []);
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};
