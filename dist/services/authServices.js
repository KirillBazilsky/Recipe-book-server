"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidator = exports.createUser = exports.verifyPassword = exports.findUserByEmail = void 0;
const Users_1 = require("../models/Users");
const findUserByEmail = async (email) => Users_1.User.findOne({ email });
exports.findUserByEmail = findUserByEmail;
const verifyPassword = async (user, password) => user.matchPassword(password);
exports.verifyPassword = verifyPassword;
const createUser = async (name, email, password) => {
    const existingUser = await (0, exports.findUserByEmail)(email);
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    const user = new Users_1.User({ name, email, password });
    await user.save();
    return user;
};
exports.createUser = createUser;
exports.passwordValidator = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
