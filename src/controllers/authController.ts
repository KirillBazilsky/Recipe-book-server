import { errorHandler } from "../services/helpers";
import { cookieOptions } from "../config/constants";
import {
  createUser,
  findUserByEmail,
  checkUserPassword,
  createToken,
} from "../services/authServices";
import { Request, Response } from "express";

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { email, password } = req.body.data;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const matched = await checkUserPassword(user, password);

    if (!matched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error: unknown) {
    errorHandler(error, res);
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { name, email, password } = req.body.data;

    const user = await createUser(name, email, password);

    if (!user) {
      return res.status(500).json({ message: "Server error" });
    }

    const token = createToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User created successfully",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error: unknown) {
    errorHandler(error, res);
  }
};
