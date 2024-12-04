import { tokenService } from "../server";
import { IUser, User } from "../models/Users";
import { userMessages } from "../config/constants";

export const checkUserPassword = async (user: IUser, password: string) =>
  user.matchPassword(password);

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = new User({ name, email, password });

  await user.save();

  return user;
};

export const passwordValidator: RegExp =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export const createToken = (user: IUser) => {
  const token = tokenService.generateToken(user);

  return token;
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(userMessages.invalidCredentials);
  }

  const isPasswordValid = await checkUserPassword(user, password);
  if (!isPasswordValid) {
    throw new Error(userMessages.invalidCredentials);
  }

  const token = createToken(user);

  return { user, token };
};

export const createUserWithToken = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  const user = await createUser(name, email, password);

  if (!user) {
    throw new Error(userMessages.userCreationError);
  }

  const token = createToken(user);

  return { user, token };
};
