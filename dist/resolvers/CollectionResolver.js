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
exports.CollectionResolver = void 0;
const type_graphql_1 = require("type-graphql");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const Collection_1 = require("../schema/Collection");
const prisma = new client_1.PrismaClient();
let CollectionInput = class CollectionInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CollectionInput.prototype, "name", void 0);
CollectionInput = __decorate([
    (0, type_graphql_1.InputType)()
], CollectionInput);
let CollectionResolver = class CollectionResolver {
    collections() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.collection.findMany({ include: { courses: true } });
        });
    }
    collection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.collection.findUnique({
                where: { id },
                include: { courses: true },
            });
        });
    }
    addCollection(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.collection.create({ data: input });
        });
    }
    updateCollection(id, name, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ctx.user.role !== 'ADMIN') {
                throw new Error('Not authorized');
            }
            return prisma.collection.update({ where: { id }, data: { name } });
        });
    }
    deleteCollection(id, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ctx.user.role !== 'ADMIN') {
                throw new Error('Not authorized');
            }
            yield prisma.collection.delete({ where: { id } });
            return true;
        });
    }
};
exports.CollectionResolver = CollectionResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Collection_1.Collection]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "collections", null);
__decorate([
    (0, type_graphql_1.Query)(() => Collection_1.Collection, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "collection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Collection_1.Collection),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CollectionInput]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "addCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Collection_1.Collection),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Arg)('name')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "updateCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(auth_1.isAuthenticated),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CollectionResolver.prototype, "deleteCollection", null);
exports.CollectionResolver = CollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CollectionResolver);
