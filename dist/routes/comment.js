"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_1 = require("../controllers/comment");
const express_validator_1 = require("express-validator");
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const router = express_1.Router();
router
    .route('/:post')
    .post(isAuth_1.default, [express_validator_1.check('comment').trim().notEmpty().withMessage('Please provide comment')], comment_1.createComment);
router.route('/delete/:post/:id').post(isAuth_1.default, comment_1.deleteComment);
router.route('/edit/:post/:id').post(isAuth_1.default, comment_1.editComment);
exports.default = router;
