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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponse = void 0;
const type_graphql_1 = require("type-graphql");
function getFieldType(type) {
    return type !== null && type !== void 0 ? type : String;
}
let BaseResponse = class BaseResponse {
    constructor(status, responseCode, responseData) {
        this.status = status;
        this.responseCode = responseCode;
        this.responseData = responseData;
    }
};
exports.BaseResponse = BaseResponse;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], BaseResponse.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], BaseResponse.prototype, "responseCode", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => getFieldType(), { nullable: true }),
    __metadata("design:type", Object)
], BaseResponse.prototype, "responseData", void 0);
exports.BaseResponse = BaseResponse = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Boolean, Number, Object])
], BaseResponse);
