import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

const recipeIdSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
});

export const validateRecipeId = (req: Request, res: Response, next: NextFunction) => {
  try {
    recipeIdSchema.parse(req.params);
    next();
  } catch (error: unknown ) {
    if (error instanceof ZodError)
    res.status(400).json({ error: error.errors[0].message });
  }
};