"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.postEditPost = exports.getEditPost = exports.getSinglePost = exports.getMyPosts = exports.getAllPosts = exports.postCreatePost = exports.getCreatePost = void 0;
const express_validator_1 = require("express-validator");
const slug_1 = __importDefault(require("../utils/slug"));
const Post_1 = __importDefault(require("../models/Post"));
const errstoobj_1 = __importDefault(require("../utils/errstoobj"));
const User_1 = __importDefault(require("../models/User"));
const Comment_1 = __importDefault(require("../models/Comment"));
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post_1.default.find({}).sort({ createdAt: -1 }).populate('author');
        res.render('home', {
            pageTitle: 'Home',
            posts,
        });
    }
    catch (e) {
        res.redirect('/auth/login');
    }
};
exports.getAllPosts = getAllPosts;
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post_1.default.find({ author: req.session.user._id })
            .sort({ createdAt: -1 })
            .populate('author');
        res.render('me', {
            pageTitle: 'My Articles',
            errors: {},
            posts,
        });
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.getMyPosts = getMyPosts;
const getSinglePost = async (req, res) => {
    try {
        const username = req.params.author.substr(1);
        const user = await User_1.default.findOne({ username });
        if (!user) {
            return res.redirect('/');
        }
        const post = await Post_1.default.findOne({
            author: user.id,
            slug: req.params.slug,
        })
            .populate('author')
            .populate({ path: 'comments', populate: { path: 'user', model: 'User' } });
        if (!post) {
            return res.redirect('/');
        }
        res.render('post', {
            pageTitle: post.title,
            post,
        });
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.getSinglePost = getSinglePost;
const getCreatePost = (req, res) => {
    res.render('create', {
        pageTitle: 'Create Post',
        errors: {},
        oldValues: {
            title: '',
            description: '',
            body: '',
        },
    });
};
exports.getCreatePost = getCreatePost;
const getEditPost = async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.redirect('/');
        }
        if (post.author != req.session.user._id) {
            return res.redirect('/');
        }
        res.render('create', {
            pageTitle: 'Edit Post',
            errors: {},
            editing: true,
            id: req.params.id,
            oldValues: {
                title: post.title,
                description: post.description,
                body: post.body,
            },
        });
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.getEditPost = getEditPost;
const postCreatePost = async (req, res) => {
    try {
        const errors = express_validator_1.validationResult(req);
        const errs = errstoobj_1.default(errors);
        const { title, description, body } = req.body;
        if (!errors.isEmpty()) {
            return res.render('create', {
                pageTitle: 'Create Post',
                errors: errs,
                oldValues: {
                    title,
                    description,
                    body,
                },
            });
        }
        const titleSlug = slug_1.default(title);
        const slugExists = await Post_1.default.findOne({
            author: req.session.user._id,
            slug: titleSlug,
        });
        if (slugExists) {
            return res.render('create', {
                pageTitle: 'Create Post',
                errors: { title: 'Your post with this title already exists' },
                oldValues: {
                    title,
                    description,
                    body,
                },
            });
        }
        const createdPost = await Post_1.default.create({
            title,
            body,
            description,
            slug: titleSlug,
            author: req.session.user._id,
        });
        const author = await User_1.default.findById(req.session.user._id);
        author.posts.push(createdPost.id);
        await author.save();
        res.redirect(`/@${req.session.user.username}/${titleSlug}`);
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.postCreatePost = postCreatePost;
const postEditPost = async (req, res) => {
    try {
        const errors = express_validator_1.validationResult(req);
        const errs = errstoobj_1.default(errors);
        const { title, description, body } = req.body;
        if (!errors.isEmpty()) {
            return res.render('create', {
                pageTitle: 'Edit Post',
                errors: errs,
                oldValues: {
                    title,
                    description,
                    body,
                },
            });
        }
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.redirect('/');
        }
        if (post.author != req.session.user._id) {
            return res.redirect('/');
        }
        const titleSlug = slug_1.default(title);
        const slugExists = await Post_1.default.findOne({
            author: req.session.user._id,
            slug: titleSlug,
        });
        if (slugExists && slugExists.slug != post.slug) {
            return res.render('create', {
                pageTitle: 'Edit Post',
                errors: { title: 'Your post with this title already exists' },
                oldValues: {
                    title,
                    description,
                    body,
                },
            });
        }
        post.title = title;
        post.slug = titleSlug;
        post.description = description;
        post.body = body;
        await post.save();
        res.redirect(`/@${req.session.user.username}/${titleSlug}`);
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.postEditPost = postEditPost;
const deletePost = async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.redirect('/');
        }
        if (post.author != req.session.user._id) {
            return res.redirect('/');
        }
        const deletedComments = await Comment_1.default.find({ post: post.id }).populate('user');
        deletedComments.forEach(async (comment) => {
            const user = await User_1.default.findById(comment.user._id);
            if (user) {
                user.comments.filter((cmt) => cmt != comment.id);
                await user.save();
            }
        });
        await Comment_1.default.deleteMany({ post: post.id });
        await Post_1.default.deleteOne({ _id: req.params.id });
        const author = await User_1.default.findById(req.session.user._id);
        author.posts = author.posts.filter((post) => post != req.params.id);
        await author.save();
        res.redirect('/me');
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/');
    }
};
exports.deletePost = deletePost;
