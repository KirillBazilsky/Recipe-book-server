"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Favorites_1 = require("./Favorites");
const authServices_1 = require("../services/authServices");
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return !(this.isModified("password") && !authServices_1.passwordValidator.test(value));
            },
            message: "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
        },
    },
    favoritesId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Favorite",
        required: false,
    },
}, { timestamps: true });
userSchema.index({ name: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.pre("save", async function (next) {
    try {
        if (!this.isNew || this.favoritesId) {
            return next();
        }
        const favorite = await Favorites_1.Favorite.create({ userId: this._id, recipes: [] });
        this.favoritesId = favorite._id;
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcryptjs_1.default.compare(enteredPassword, this.password);
};
exports.User = mongoose_1.default.model("User", userSchema);
