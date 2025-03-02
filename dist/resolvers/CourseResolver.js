"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseResolver = void 0;
const type_graphql_1 = require("type-graphql");
const client_1 = require("@prisma/client");
const Course_1 = require("../schema/Course");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
let CourseInput = class CourseInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CourseInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CourseInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CourseInput.prototype, "duration", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CourseInput.prototype, "outcome", void 0);
CourseInput = __decorate([
    (0, type_graphql_1.InputType)()
], CourseInput);
let CourseResolver = class CourseResolver {
    courses(limit, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.course.findMany({
                take: limit,
                orderBy: {
                    title: sortOrder === 'DESC' ? 'desc' : 'asc',
                },
            });
        });
    }
    course(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.course.findUnique({ where: { id } });
        });
    }
    addCourse(input, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.course.create({
                data: Object.assign(Object.assign({}, input), { createdById: ctx.user.userId }),
            });
        });
    }
    updateCourse(id, input, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield prisma.course.findUnique({ where: { id } });
            if (!course)
                throw new Error('Course not found');
            if (ctx.user.role !== 'ADMIN' && course.createdById !== ctx.user.userId) {
                throw new Error('Not authorized');
            }
            return prisma.course.update({
                where: { id },
                data: input,
            });
        });
    }
    deleteCourse(id, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield prisma.course.findUnique({ where: { id } });
            if (!course)
                throw new Error('Course not found');
            if (ctx.user.role !== 'ADMIN' && course.createdById !== ctx.user.userId) {
                throw new Error('Not authorized');
            }
            yield prisma.course.delete({ where: { id } });
            return true;
        });
    }
};
exports.CourseResolver = CourseResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Course_1.Course]),
    __param(0, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('sortOrder', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "courses", null);
__decorate([
    (0, type_graphql_1.Query)(() => Course_1.Course, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "course", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Course_1.Course),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CourseInput, Object]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "addCourse", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Course_1.Course),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Arg)('input')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CourseInput, Object]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "updateCourse", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "deleteCourse", null);
exports.CourseResolver = CourseResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CourseResolver);
