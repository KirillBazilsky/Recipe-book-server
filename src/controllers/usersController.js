import { findUserById, updateUser } from "../services/userServices.js";
import { getUserFavoritesId } from "../services/favoritesServices.js";

const updateUserRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body.data;
    const user = await updateUser(userId, name, email, password);

    res.status(200).json({
      message: "User updated successfully",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserById(userId);
    const favoritesId = await getUserFavoritesId(userId);  
    
    res.status(200).json({
      message: "User successfully found",
      user: { name: user.name, email: user.email, id: user.id, favoritesId },
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
export { updateUserRequest };
