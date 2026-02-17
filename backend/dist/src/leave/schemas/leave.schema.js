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
exports.LeaveSchema = exports.Leave = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
let Leave = class Leave extends mongoose_2.Document {
};
exports.Leave = Leave;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Leave.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: enums_1.LeaveType, required: true }),
    __metadata("design:type", String)
], Leave.prototype, "leaveType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Leave.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Leave.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Leave.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: enums_1.LeaveStatus, default: enums_1.LeaveStatus.PENDING }),
    __metadata("design:type", String)
], Leave.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Leave.prototype, "reviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Leave.prototype, "reviewedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Leave.prototype, "reviewNote", void 0);
exports.Leave = Leave = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Leave);
exports.LeaveSchema = mongoose_1.SchemaFactory.createForClass(Leave);
exports.LeaveSchema.index({ userId: 1, startDate: 1 });
exports.LeaveSchema.index({ status: 1 });
exports.LeaveSchema.index({ startDate: 1, endDate: 1 });
//# sourceMappingURL=leave.schema.js.map