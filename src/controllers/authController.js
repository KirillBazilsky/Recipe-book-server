import { tokenService } from "../../server.js";
import { cookieOptions } from "../config/constants.js";
import {
  createUser,
  findUserByEmail,
  verifyPassword,
} from "../services/authServices.js";
import { getUserFavoritesId } from "../services/favoritesServices.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body.data;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const matched = await verifyPassword(user, password);

    if (!matched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const favoritesId = await getUserFavoritesId(user.id); 

    const token = tokenService.generateToken({
      userId: user.id,
      name: user.name,
      favoritesId: user.favoritesId
    });

    res.cookie("token", token, cookieOptions);

    res
      .status(200)
      .json({
        message: "Login successful",
        user: { name: user.name, email: user.email, id: user.id, favoritesId },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body.data;

    const user = await createUser(name, email, password);

    res.status(201).json({
      message: "User created successfully",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error) {
    if (error.message === "User with this email already exists") {
      return res.status(400).json({ message: error.message });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};
