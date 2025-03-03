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
exports.userLoader = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dataloader_1 = __importDefault(require("dataloader"));
exports.prisma = new client_1.PrismaClient();
const batchUsers = (userIds) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield exports.prisma.user.findMany({
        where: { id: { in: [...userIds] } },
    });
    const userMap = new Map(users.map((user) => [user.id, user]));
    return userIds.map((id) => { var _a; return (_a = userMap.get(id)) !== null && _a !== void 0 ? _a : null; });
});
exports.userLoader = new dataloader_1.default(batchUsers);
