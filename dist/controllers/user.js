"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPosts = exports.updateUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const express_validator_1 = require("express-validator");
const errstoobj_1 = __importDefault(require("../utils/errstoobj"));
const Post_1 = __importDefault(require("../models/Post"));
const updateUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.session.user._id);
        const posts = await Post_1.default.find({ author: req.session.user._id })
            .sort({ createdAt: -1 })
            .populate('author');
        if (!user) {
            return res.redirect('/');
        }
        const errors = express_validator_1.validationResult(req);
        const errs = errstoobj_1.default(errors);
        if (!errors.isEmpty()) {
            return res.render('me', {
                pageTitle: 'Profile',
                errors: errs,
                posts,
            });
        }
        const { name, username } = req.body;
        if (username && username !== req.session.user.username) {
            const userNameExists = await User_1.default.findOne({ username });
            if (userNameExists) {
                return res.render('me', {
                    pageTitle: 'Profile',
                    errors: { username: 'Username already exists' },
                    posts,
                });
            }
        }
        user.name = name;
        user.username = username;
        await user.save();
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(() => {
            res.redirect('/me');
        });
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.updateUser = updateUser;
const getUserPosts = async (req, res) => {
    try {
        const username = req.params.username.substr(1);
        const user = await User_1.default.findOne({ username }).populate('posts');
        if (!user) {
            return res.redirect('/');
        }
        res.render('userPost', {
            pageTitle: '@' + user.username,
            userPost: user,
        });
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.getUserPosts = getUserPosts;
