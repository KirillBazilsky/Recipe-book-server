import { tokenService } from "../server";
import { cookieOptions } from "../config/constants";
import {
  createUser,
  findUserByEmail,
  verifyPassword,
} from "../services/authServices";
import { NextFunction, Request, Response } from "express";
import { MongooseError } from "mongoose";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body.data;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
    } else {
      const matched = await verifyPassword(user, password);

      if (!matched) {
        res.status(400).json({ message: "Invalid credentials" });
      }

      const token = tokenService.generateToken({
        userId: user.id,
        name: user.name,
        favoritesId: user.favoritesId,
      });

      res.cookie("token", token, cookieOptions);

      res.status(200).json({
        message: "Login successful",
        user: { name: user.name, email: user.email, id: user.id },
      });
    }
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body.data;

    const user = await createUser(name, email, password);

    const token = tokenService.generateToken({
      userId: user.id,
      name: user.name,
      favoritesId: user.favoritesId,
    });

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User created successfully",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error) {
    if (error instanceof MongooseError) {
      if (error.message === "User with this email already exists") {
        res.status(400).json({ message: error.message });
      }

      if (error.name === "ValidationError") {
        res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};
