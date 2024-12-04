import { errorHandler } from "../services/helpers";
import { cookieOptions } from "../config/constants";
import {
  authenticateUser,
  createUserWithToken,
} from "../services/authServices";
import { Request, Response } from "express";

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body.data;
    const { user, token } = await authenticateUser(email, password);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password } = req.body.data;

    const {user, token } = await createUserWithToken(name, email, password)

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User created successfully",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};
