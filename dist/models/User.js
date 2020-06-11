"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gravatar_1 = __importDefault(require("gravatar"));
const slug_1 = __importDefault(require("../utils/slug"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }],
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    if (!this.username) {
        this.username = slug_1.default(this.email.split('@')[0] + Date.now());
    }
    if (!this.avatar) {
        this.avatar = gravatar_1.default.url(this.email, {
            s: '500',
            r: 'pg',
            d: 'mm',
        });
    }
    next();
});
const User = mongoose_1.model('User', userSchema);
exports.default = User;
