"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.getVerify = exports.logout = exports.postLogin = exports.getLogin = exports.postSignup = exports.getSignup = void 0;
const url_1 = __importDefault(require("url"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const errstoobj_1 = __importDefault(require("../utils/errstoobj"));
const bcryptjs_1 = require("bcryptjs");
const mail_1 = __importDefault(require("../utils/mail"));
const template_1 = __importDefault(require("../utils/template"));
const jwt_1 = require("../utils/jwt");
const siteUrl = (req) => {
    return url_1.default.format({
        protocol: req.protocol,
        host: req.get('host'),
    });
};
const getSignup = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        errors: {},
        oldValue: {
            name: '',
            password: '',
            confirmPassword: '',
            email: '',
        },
    });
};
exports.getSignup = getSignup;
const postSignup = async (req, res) => {
    try {
        const errors = express_validator_1.validationResult(req);
        const errs = errstoobj_1.default(errors);
        const { name, password, confirmPassword, email } = req.body;
        if (!errors.isEmpty()) {
            return res.render('auth/signup', {
                pageTitle: 'Signup',
                errors: errs,
                oldValue: {
                    name,
                    password,
                    confirmPassword,
                    email,
                },
            });
        }
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.render('auth/signup', {
                pageTitle: 'Signup',
                errors: { email: 'Email already in use' },
                oldValue: {
                    name,
                    password,
                    confirmPassword,
                    email,
                },
            });
        }
        if (password !== confirmPassword) {
            return res.render('auth/signup', {
                pageTitle: 'Signup',
                errors: { confirmPassword: "Passwords don't match" },
                oldValue: {
                    name,
                    password,
                    confirmPassword,
                    email,
                },
            });
        }
        const hashedPassword = await bcryptjs_1.hash(password, 10);
        await User_1.default.create({ name, email, password: hashedPassword });
        req.flash('visitVerify', JSON.stringify([true, email]));
        res.redirect('/auth/verify');
        await mail_1.default({
            to: email,
            subject: 'Verify your email address',
            html: template_1.default({
                text: 'Please verify your email',
                button: 'VERIFY',
                link: siteUrl(req) + `/auth/verify/${jwt_1.createToken(email)}`,
            }),
        });
    }
    catch (e) {
        console.log(e.message);
        res.redirect('/auth/signup');
    }
};
exports.postSignup = postSignup;
const getLogin = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        errors: {},
        oldValue: {
            password: '',
            email: '',
        },
    });
};
exports.getLogin = getLogin;
const postLogin = async (req, res) => {
    try {
        const errors = express_validator_1.validationResult(req);
        const errs = errstoobj_1.default(errors);
        const { password, email } = req.body;
        if (!errors.isEmpty()) {
            return res.render('auth/login', {
                pageTitle: 'Login',
                errors: errs,
                oldValue: {
                    password,
                    email,
                },
            });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.render('auth/login', {
                pageTitle: 'Login',
                errors: { email: 'Email not found' },
                oldValue: {
                    password,
                    email,
                },
            });
        }
        const matchPassword = await bcryptjs_1.compare(password, user.password);
        if (!matchPassword) {
            return res.render('auth/login', {
                pageTitle: 'Login',
                errors: { password: 'Wrong password' },
                oldValue: {
                    password,
                    email,
                },
            });
        }
        if (!user.verified) {
            return res.render('auth/login', {
                pageTitle: 'Login',
                errors: { email: 'Email not verified' },
                oldValue: {
                    password,
                    email,
                },
            });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(() => {
            res.redirect('/');
        });
    }
    catch (e) {
        res.redirect('/auth/signup');
    }
};
exports.postLogin = postLogin;
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
exports.logout = logout;
const getVerify = (req, res) => {
    const email = req.flash('visitVerify')[0];
    if (!email) {
        return res.redirect('/');
    }
    res.render('verify', {
        pageTitle: 'Verify',
        email,
    });
};
exports.getVerify = getVerify;
const verify = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt_1.verifyToken(token);
        if (!decoded)
            return res.redirect('/');
        const user = await User_1.default.findOne({ email: decoded.payload });
        if (!user)
            return res.redirect('/');
        user.verified = true;
        await user.save();
        res.redirect('/auth/login');
    }
    catch (e) {
        res.redirect('/');
    }
};
exports.verify = verify;
