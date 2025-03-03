"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnerOrAdmin = exports.isAdmin = exports.verifyToken = exports.generateToken = exports.comparePasswords = exports.hashPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("./prisma");
const client_1 = require("@prisma/client");
const jwt_1 = require("./jwt");
const JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'super-secure-secret';
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () { return bcryptjs_1.default.hash(password, 10); });
exports.hashPassword = hashPassword;
const comparePasswords = (password, hash) => __awaiter(void 0, void 0, void 0, function* () { return bcryptjs_1.default.compare(password, hash); });
exports.comparePasswords = comparePasswords;
const generateToken = (userId, role) => jsonwebtoken_1.default.sign({ userId, role }, JWT_SECRET, {
    expiresIn: (0, jwt_1.tokenExpiration)(),
});
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        console.log('🔹 Verifying Token:', token);
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        console.error('❌ Token Verification Failed:');
        throw new Error('Invalid or expired token');
    }
};
exports.verifyToken = verifyToken;
const isAdmin = (_a, next_1) => __awaiter(void 0, [_a, next_1], void 0, function* ({ context }, next) {
    if (!context.user) {
        throw new Error('Unauthorized');
    }
    if (context.user.role !== 'ADMIN') {
        throw new Error('Permission denied');
    }
    return next();
});
exports.isAdmin = isAdmin;
const isOwnerOrAdmin = (_a, next_1) => __awaiter(void 0, [_a, next_1], void 0, function* ({ context, args }, next) {
    if (!context.user)
        throw new Error('Unauthorized');
    const course = yield prisma_1.prisma.course.findUnique({ where: { id: args.id } });
    if (!course)
        throw new Error('Course not found');
    if (context.user.role !== client_1.Role.ADMIN &&
        course.createdById !== context.user.userId) {
        throw new Error('Permission denied');
    }
    return next();
});
exports.isOwnerOrAdmin = isOwnerOrAdmin;
