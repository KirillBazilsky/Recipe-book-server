"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRequest = exports.getUser = void 0;
const mongoose_1 = require("mongoose");
const userServices_1 = require("../services/userServices");
const updateUserRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
        }
        const { userId: authUserId } = req.user;
        const { name, email, password } = req.body.data;
        if (userId !== authUserId) {
            res.status(401).json({ error: "Access denied" });
        }
        const user = await (0, userServices_1.updateUser)(userId, name, email, password);
        res.status(200).json({
            message: "User updated successfully",
            user: { name: user.name, email: user.email, id: user.id },
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            if (error.message === "User not found") {
                res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.updateUserRequest = updateUserRequest;
const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
        }
        const { userId: authUserId } = req.user;
        if (userId !== authUserId) {
            res.status(404).json({ error: "Access denied" });
        }
        const user = await (0, userServices_1.findUserById)(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        }
        else {
            res.status(200).json({
                message: "User successfully found",
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                },
            });
        }
    }
    catch (error) {
        if (error instanceof mongoose_1.MongooseError) {
            if (error.message === "User not found") {
                res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: "Unknown error occurred" });
    }
};
exports.getUser = getUser;
