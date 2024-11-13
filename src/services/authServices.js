import { User } from "../models/Users.js";

export const findUserByEmail = async (email) => User.findOne({ email });

export const verifyPassword = async (user, password) => user.matchPassword(password);

export const createUser = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = new User({ name, email, password });
  
  await user.save();

  return user;
};

export const passwordValidator =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;