import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    ingredients: [
      {
        _id: false,
        name: { type: String, required: true },
        quantity: { type: String, required: true },
      },
    ],
    instructions: { type: String, required: true },
    category: { type: String },
    creator: {
      name: { type: String },
      id: { type: String },
    },
  },
  { timestamps: true }
);

recipeSchema.index({ name: 1 }, { unique: true });

export const Recipe = mongoose.model("Recipe", recipeSchema);
