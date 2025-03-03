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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static register(username_1, password_1) {
        return __awaiter(this, arguments, void 0, function* (username, password, role = client_1.Role.USER) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            yield prisma_1.prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    role,
                },
            });
            return { message: 'Registration successful' };
        });
    }
    static login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.prisma.user.findUnique({ where: { username } });
            if (!user)
                throw new Error('Invalid credentials');
            const valid = yield bcryptjs_1.default.compare(password, user.password);
            if (!valid)
                throw new Error('Invalid credentials');
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            return AuthService.generateToken(user.id, user.role);
        });
    }
    static generateToken(userId, role) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jsonwebtoken_1.default.sign({ userId: userId, role: role }, process.env.JWT_SECRET, {
            expiresIn: (0, jwt_1.tokenExpiration)(),
        });
    }
}
exports.AuthService = AuthService;
