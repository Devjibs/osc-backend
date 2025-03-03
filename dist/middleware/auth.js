"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const auth_1 = require("../utils/auth");
const isAuthenticated = ({ context }, next) => {
    let token = context.req.headers.authorization;
    if (!token)
        throw new Error('Unauthorized');
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    const user = (0, auth_1.verifyToken)(token);
    if (!user)
        throw new Error('Invalid token');
    context.user = user;
    return next();
};
exports.isAuthenticated = isAuthenticated;
