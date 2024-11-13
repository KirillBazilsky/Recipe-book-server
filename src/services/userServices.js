import { User } from "../models/Users.js";
import { passwordValidator } from "./authServices.js";
import { mergeDefined } from "./helpers.js";

export const findUserByEmail = async (email) => User.findOne({ email });

export const findUserById = async (id) => User.findById(id);

export const createUser = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = new User({ name, email, password });
  
  await user.save();

  return user;
};

export const updateUser = async (userId, name, email, password) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updatedData = { name, email };
  if (password) {
    updatedData.password = password;
  }
  
  const updatedUser = mergeDefined(updatedData, user);

  Object.assign(user, updatedUser);
  
  await user.save();

  return user;
};
