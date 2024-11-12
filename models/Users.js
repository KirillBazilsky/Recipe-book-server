const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const passwordValidator =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return passwordValidator.test(value);
      },
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
    },
  },
});

userSchema.index({ name: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, passwordValidator };
