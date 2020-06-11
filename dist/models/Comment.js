"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
    },
}, {
    timestamps: true,
});
const Comment = mongoose_1.model('Comment', commentSchema);
exports.default = Comment;
