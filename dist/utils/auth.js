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
exports.verifyToken = exports.generateToken = exports.comparePasswords = exports.hashPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'super-secure-secret';
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () { return bcryptjs_1.default.hash(password, 10); });
exports.hashPassword = hashPassword;
const comparePasswords = (password, hash) => __awaiter(void 0, void 0, void 0, function* () { return bcryptjs_1.default.compare(password, hash); });
exports.comparePasswords = comparePasswords;
const generateToken = (userId, role) => jsonwebtoken_1.default.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });
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
