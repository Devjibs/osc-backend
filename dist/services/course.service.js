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
exports.CourseService = void 0;
const prisma_1 = require("../utils/prisma");
const redis_1 = __importDefault(require("../utils/redis"));
const isTestEnv = process.env.NODE_ENV === 'test';
class CourseService {
    static getCourses(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `courses:${limit !== null && limit !== void 0 ? limit : 'all'}`;
            if (!isTestEnv) {
                const cachedData = yield redis_1.default.get(cacheKey);
                if (cachedData) {
                    console.log('🔹 Serving from Redis Cache');
                    return JSON.parse(cachedData);
                }
            }
            const courses = yield prisma_1.prisma.course.findMany({ take: limit });
            if (!isTestEnv) {
                yield redis_1.default.setex(cacheKey, 600, JSON.stringify(courses));
            }
            return courses;
        });
    }
    static addCourse(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.course.create({
                data: Object.assign(Object.assign({}, input), { createdById: userId }),
            });
        });
    }
    static updateCourse(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.course.update({
                where: { id },
                data: input,
            });
        });
    }
    static deleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.course.delete({ where: { id } });
            return true;
        });
    }
}
exports.CourseService = CourseService;
