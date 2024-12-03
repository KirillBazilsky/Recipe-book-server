"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.findUserById = exports.findUserByEmail = void 0;
const Users_1 = require("../models/Users");
const helpers_1 = require("./helpers");
const findUserByEmail = async (email) => Users_1.User.findOne({ email });
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => Users_1.User.findById(id);
exports.findUserById = findUserById;
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
const updateUser = async (userId, name, email, password) => {
    const user = await Users_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const updatedData = { name, email };
    if (password) {
        updatedData.password = password;
    }
    const updatedUser = (0, helpers_1.mergeDefined)(updatedData, user);
    Object.assign(user, updatedUser);
    await user.save();
    return user;
};
exports.updateUser = updateUser;
