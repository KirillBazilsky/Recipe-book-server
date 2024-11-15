import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { passwordValidator } from "../services/authServices.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return !(this.isModified("password") && !passwordValidator.test(value))
      },
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
    },
  },
});

userSchema.index({ name: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
