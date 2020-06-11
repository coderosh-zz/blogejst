"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const post_1 = require("../controllers/post");
const user_1 = require("../controllers/user");
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const router = express_1.Router();
router.route('/').get(post_1.getAllPosts);
router
    .route('/create')
    .get(isAuth_1.default, post_1.getCreatePost)
    .post(isAuth_1.default, [
    express_validator_1.check('title').trim().notEmpty().withMessage('Please provide title'),
    express_validator_1.check('description')
        .trim()
        .notEmpty()
        .withMessage('Please provide description'),
    express_validator_1.check('body').notEmpty().trim().withMessage('Please provide body'),
], post_1.postCreatePost);
router
    .route('/me')
    .get(isAuth_1.default, post_1.getMyPosts)
    .post(isAuth_1.default, [
    express_validator_1.check('name').trim().notEmpty().withMessage('Name cannot be empty'),
    express_validator_1.check('username')
        .trim()
        .notEmpty()
        .withMessage('Username cannot be empty'),
], user_1.updateUser);
router.route('/edit/:id').get(isAuth_1.default, post_1.getEditPost).post(isAuth_1.default, post_1.postEditPost);
router.route('/delete/:id').post(isAuth_1.default, post_1.deletePost);
router.route('/:author/:slug').get(post_1.getSinglePost);
exports.default = router;
