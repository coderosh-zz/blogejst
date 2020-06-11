"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const marked_1 = __importDefault(require("marked"));
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const window = new jsdom_1.JSDOM().window;
const dompurify = dompurify_1.default(window);
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    body: {
        type: String,
        required: true,
    },
    html: {
        type: String,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }],
}, {
    timestamps: true,
});
postSchema.pre('validate', function (next) {
    if (this.body) {
        this.html = dompurify.sanitize(marked_1.default(this.body, { breaks: true }));
    }
    next();
});
const Post = mongoose_1.model('Post', postSchema);
exports.default = Post;
