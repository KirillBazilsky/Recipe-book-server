const { User } = require("../models/Users");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600000
      });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginUser };
