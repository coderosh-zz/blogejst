"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    next();
};
exports.default = notAuth;
