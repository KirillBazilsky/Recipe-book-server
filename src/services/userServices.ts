import { userMessages } from "../config/constants";
import { IUser, User } from "../models/Users";
import { mergeDefined } from "./helpers";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser: IUser | null = await User.findOne({ email });

  if (existingUser) {
    throw new Error(userMessages.emailExist);
  }

  const user = new User({ name, email, password });

  await user.save();

  return user;
};

export const updateUser = async (
  userId: string,
  name: string,
  email: string,
  password: string
) => {
  const user: IUser | null = await User.findById(userId);

  if (!user) {
    throw new Error(userMessages.notFound);
  }

  const updatedData: { name?: string; email?: string; password?: string } = {
    name,
    email,
  };

  if (password) {
    updatedData.password = password;
  }

  const updatedUser = mergeDefined(updatedData, user);

  Object.assign(user, updatedUser);

  await user.save();

  return user;
};
