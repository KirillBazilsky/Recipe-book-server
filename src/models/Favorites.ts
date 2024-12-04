import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFavorite extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; 
  recipes: mongoose.Types.ObjectId[]; 
}

const favoriteSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
);

export const Favorite: Model<IFavorite> = mongoose.model<IFavorite>('Favorite', favoriteSchema);
