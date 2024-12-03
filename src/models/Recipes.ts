import mongoose, { Schema, Document, Model } from 'mongoose';

interface IIngredient {
  name: string;
  quantity: string;
}

interface ICreator {
  name?: string;
  id?: string;
}

export interface IRecipe extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  ingredients: IIngredient[];
  instructions: string;
  category?: string;
  creator?: ICreator;
  createdAt?: Date; 
  updatedAt?: Date; 
}

const recipeSchema: Schema = new Schema<IRecipe>(
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

export const Recipe: Model<IRecipe> = mongoose.model<IRecipe>('Recipe', recipeSchema);
