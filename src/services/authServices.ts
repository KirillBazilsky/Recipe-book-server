import { tokenService } from "../server";
import { IUser, User } from "../models/Users";

export const findUserByEmail = async (email: string) => User.findOne({ email });

export const checkUserPassword = async (user: IUser, password: string) => user.matchPassword(password);

export const createUser = async (name: string, email: string, password: string) => {
  const existingUser = await findUserByEmail(email);

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
}