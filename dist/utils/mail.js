"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});
const sendMail = async ({ to, subject, html, }) => {
    const msg = {
        from: process.env.NODEMAILER_USER,
        to,
        html,
        subject,
    };
    return transporter.sendMail(msg);
};
exports.default = sendMail;
