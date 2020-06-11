"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editComment = exports.deleteComment = exports.createComment = void 0;
const User_1 = __importDefault(require("../models/User"));
const express_validator_1 = require("express-validator");
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
const createComment = async (req, res) => {
    try {
        const createdBy = await User_1.default.findById(req.session.user._id);
        const post = await Post_1.default.findById(req.params.post).populate('author');
        if (!createdBy || !post)
            return res.redirect('/');
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty())
            return res.redirect(`/@${post.author.username}/${post.slug}`);
        const comment = await Comment_1.default.create({
            user: createdBy.id,
            post: post.id,
            comment: req.body.comment,
        });
        createdBy.comments.push(comment.id);
        post.comments.push(comment.id);
        await createdBy.save();
        await post.save();
        res.redirect(`/@${post.author.username}/${post.slug}`);
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.createComment = createComment;
const deleteComment = async (req, res) => {
    try {
        const deletedBy = await User_1.default.findById(req.session.user._id);
        const post = await Post_1.default.findById(req.params.post).populate('author');
        if (!deletedBy || !post)
            return res.redirect('/');
        post.comments.filter((comment) => comment != req.params.id);
        deletedBy.comments.filter((comment) => comment != req.params.id);
        const comment = await Comment_1.default.findById(req.params.id);
        if (!comment || !deletedBy.comments.includes(comment.id)) {
            return res.redirect('/');
        }
        await Comment_1.default.remove({ _id: req.params.id });
        await post.save();
        await deletedBy.save();
        res.redirect(`/@${post.author.username}/${post.slug}`);
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.deleteComment = deleteComment;
const editComment = async (req, res) => {
    try {
        const editedBy = await User_1.default.findById(req.session.user._id);
        const post = await Post_1.default.findById(req.params.post).populate('author');
        if (!editedBy || !post)
            return res.redirect('/');
        const comment = await Comment_1.default.findById(req.params.id);
        if (!comment || !editedBy.comments.includes(comment.id)) {
            return res.redirect('/');
        }
        comment.comment = req.body.comment;
        await comment.save();
        res.redirect(`/@${post.author.username}/${post.slug}`);
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.editComment = editComment;
