"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenExpiration = void 0;
const tokenExpiration = () => process.env.TOKEN_EXPIRES_IN ? Number(process.env.TOKEN_EXPIRES_IN) : 3600;
exports.tokenExpiration = tokenExpiration;
