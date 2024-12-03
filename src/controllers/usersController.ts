import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Error, MongooseError } from "mongoose";
import { findUserById, updateUser } from "../services/userServices";

const updateUserRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
    }

    const { userId: authUserId } = req.user as JwtPayload;
    const { name, email, password } = req.body.data;

    if (userId !== authUserId) {
      res.status(401).json({ error: "Access denied" });
    }

    const user = await updateUser(userId, name, email, password);

    res.status(200).json({
      message: "User updated successfully",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      if (error.message === "User not found") {
        res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Unknown error occurred" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
    }

    const { userId: authUserId } = req.user as JwtPayload;

    if (userId !== authUserId) {
      res.status(404).json({ error: "Access denied" });
    }

    const user = await findUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({
        message: "User successfully found",
        user: {
          name: user.name,
          email: user.email,
          id: user.id,
        },
      });
    }

  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      if (error.message === "User not found") {
        res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }

    res.status(500).json({ message: "Unknown error occurred" });
  }
};
export { updateUserRequest };
