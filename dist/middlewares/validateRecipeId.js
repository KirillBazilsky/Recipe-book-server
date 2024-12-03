"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecipeId = void 0;
const zod_1 = require("zod");
const recipeIdSchema = zod_1.z.object({
    recipeId: zod_1.z.string().min(1, "Recipe ID is required"),
});
const validateRecipeId = (req, res, next) => {
    try {
        recipeIdSchema.parse(req.params);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError)
            res.status(400).json({ error: error.errors[0].message });
    }
};
exports.validateRecipeId = validateRecipeId;
