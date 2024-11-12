const { User, passwordValidator } = require("../models/Users");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const user = new User({ name, email, password });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: { name: user.name, email: user.email, _id: user._id },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      if (!passwordValidator.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
        });
      }

      user.password = password;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: { name: user.name, email: user.email, _id: user._id },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, updateUser };
