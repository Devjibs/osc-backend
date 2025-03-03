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
const prisma_1 = require("../utils/prisma");
const Course_1 = require("../schema/Course");
const CourseInput_1 = require("../schema/CourseInput");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../utils/auth");
const User_1 = require("../schema/User");
const course_service_1 = require("../services/course.service");
let CourseResolver = class CourseResolver {
    courses(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_service_1.CourseService.getCourses(limit);
        });
    }
    createdBy(course) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.userLoader.load(course.createdById);
        });
    }
    addCourse(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_service_1.CourseService.addCourse(input, context.user.userId);
        });
    }
    updateCourse(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_service_1.CourseService.updateCourse(id, input);
        });
    }
    deleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield course_service_1.CourseService.deleteCourse(id);
        });
    }
};
exports.CourseResolver = CourseResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Course_1.Course]),
    __param(0, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "courses", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => User_1.User),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Course_1.Course]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "createdBy", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Course_1.Course),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated),
    __param(0, (0, type_graphql_1.Arg)('input', () => CourseInput_1.CourseInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CourseInput_1.CourseInput, Object]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "addCourse", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Course_1.Course),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated, auth_2.isOwnerOrAdmin),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Arg)('input', () => CourseInput_1.CourseInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CourseInput_1.CourseInput]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "updateCourse", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated, auth_2.isAdmin),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "deleteCourse", null);
exports.CourseResolver = CourseResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Course_1.Course)
], CourseResolver);
