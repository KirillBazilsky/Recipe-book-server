import { z } from "zod";

const recipeIdSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
});

export const validateRecipeId = (req, res, next) => {
  try {
    recipeIdSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors[0].message });
  }
};