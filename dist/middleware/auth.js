"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const auth_1 = require("../utils/auth");
const isAuthenticated = ({ context }, next) => {
    let token = context.req.headers.authorization;
    if (!token)
        throw new Error('Unauthorized');
    // ✅ Fix: Remove "Bearer " before verifying
    if (token.startsWith('Bearer ')) {
        token = token.slice(7); // Remove "Bearer " prefix
    }
    const user = (0, auth_1.verifyToken)(token);
    if (!user)
        throw new Error('Invalid token');
    context.user = user;
    return next();
};
exports.isAuthenticated = isAuthenticated;
