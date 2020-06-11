"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errsToObj = (errors) => {
    const errArray = errors.array();
    const errs = {};
    for (let i = 0; i < errArray.length; i++) {
        const key = errArray[i].param;
        errs[key] = errArray[i].msg;
    }
    return errs;
};
exports.default = errsToObj;
