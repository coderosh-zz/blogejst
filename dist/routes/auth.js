"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const notAuth_1 = __importDefault(require("../middlewares/notAuth"));
const router = express_1.Router();
router
    .route('/login')
    .get(auth_1.getLogin)
    .post([
    express_validator_1.check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Please provide valid email'),
    express_validator_1.check('password').notEmpty().withMessage('Please provide password'),
], auth_1.postLogin);
router
    .route('/signup')
    .get(auth_1.getSignup)
    .post([
    express_validator_1.check('name').trim().notEmpty().withMessage('Please provid name'),
    express_validator_1.check('password')
        .trim()
        .notEmpty()
        .withMessage('Please provide password'),
    express_validator_1.check('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Please provide confirm password'),
    express_validator_1.check('email')
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage('Please provide valid email'),
], auth_1.postSignup);
router.route('/logout').post(isAuth_1.default, auth_1.logout);
router.route('/verify').get(notAuth_1.default, auth_1.getVerify);
router.route('/verify/:token').get(notAuth_1.default, auth_1.verify);
exports.default = router;
