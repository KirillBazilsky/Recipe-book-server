import { createUser, updateUser } from "../services/userServices.js";

const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body.data;
    const user = await updateUser(userId, name, email, password);

    res.status(200).json({
      message: "User updated successfully",
      user: { name: user.name, email: user.email, _id: user._id },
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export { updateUserController };
