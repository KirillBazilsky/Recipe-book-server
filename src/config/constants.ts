import { ICookieOptions } from "../interfaces/cookieOption";

const ONE_HOUR = 3600000;

export const cookieOptions: ICookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ONE_HOUR, 
  };

export const userMessages: Record<string, string> = {
  unknown: "Unknown error occurred",
  emailExist: "User with this email already exists",
  validationError: "Validation Error",
  userNotFound: "User not found",
  recipeNotFound: "Recipe not found",
  invalidCredentials: "Invalid credentials",
  userCreationError: "Error while create user",
  duplicateFavorites: "Recipe already exists in favorites",
  existingRecipe: "REcipe with this name already exist",
  recipeAdded: "Recipe successfully added",
  recipeRemoved: "Recipe successfully removed",
  idRequired: "recipe ID is required",
  noFavorites: "User has no favorite recipes",
  missingSecret: "Missing process.env.JWT_SECRET",
  invalidToken: "Invalid token"
}