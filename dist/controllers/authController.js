"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const server_1 = require("../server");
const constants_1 = require("../config/constants");
const authServices_1 = require("../services/authServices");
const mongoose_1 = require("mongoose");
const loginUser = async (req, res) => {
    const { email, password } = req.body.data;
    try {
        const user = await (0, authServices_1.findUserByEmail)(email);
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
        }
        else {
            const matched = await (0, authServices_1.verifyPassword)(user, password);
            if (!matched) {
                res.status(400).json({ message: "Invalid credentials" });
            }
            const token = server_1.tokenService.generateToken({
                userId: user.id,
                name: user.name,
                favoritesId: user.favoritesId,
            });
            res.cookie("token", token, constants_1.cookieOptions);
            res.status(200).json({
                message: "Login successful",
                user: { name: user.name, email: user.email, id: user.id },
            });
        }
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.loginUser = loginUser;
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body.data;
        const user = await (0, authServices_1.createUser)(name, email, password);
        const token = server_1.tokenService.generateToken({
            userId: user.id,
            name: user.name,
            favoritesId: user.favoritesId,
        });
        res.cookie("token", token, constants_1.cookieOptions);
        res.status(201).json({
            message: "User created successfully",
            user: { name: user.name, email: user.email, id: user.id },
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
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
exports.registerUser = registerUser;
