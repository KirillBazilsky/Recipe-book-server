import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from "bcryptjs";
import { Favorite, IFavorite } from "./Favorites";
import { passwordValidator } from "../services/authServices";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  favoritesId: mongoose.Types.ObjectId; 
  matchPassword(enteredPassword: string): Promise<boolean>; 
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (this: IUser, value: string): boolean {
          return !(this.isModified("password") && !passwordValidator.test(value));
        },
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
      },
    },
    favoritesId: {
      type: Schema.Types.ObjectId,
      ref: "Favorite",
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ name: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.pre<IUser>("save", async function (next) {
  try {
    if (!this.isNew || this.favoritesId) {
      return next();
    }

    const favorite = await Favorite.create({ userId: this._id, recipes: [] }) as IFavorite;

    this.favoritesId = favorite._id;
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
