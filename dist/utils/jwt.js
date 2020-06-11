"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || 'secretkey';
const createToken = (payload) => {
    return jsonwebtoken_1.sign({ payload }, jwtSecret, {
        expiresIn: '1d',
    });
};
exports.createToken = createToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.verify(token, jwtSecret);
};
exports.verifyToken = verifyToken;
