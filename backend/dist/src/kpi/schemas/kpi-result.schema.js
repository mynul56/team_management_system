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
exports.KpiResultSchema = exports.KpiResult = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let KpiResult = class KpiResult extends mongoose_2.Document {
};
exports.KpiResult = KpiResult;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KpiResult.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Kpi', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KpiResult.prototype, "kpiId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], KpiResult.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], KpiResult.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 100 }),
    __metadata("design:type", Number)
], KpiResult.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], KpiResult.prototype, "adminFeedback", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], KpiResult.prototype, "bonusAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'USD' }),
    __metadata("design:type", String)
], KpiResult.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], KpiResult.prototype, "isAutoCalculated", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KpiResult.prototype, "updatedBy", void 0);
exports.KpiResult = KpiResult = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], KpiResult);
exports.KpiResultSchema = mongoose_1.SchemaFactory.createForClass(KpiResult);
exports.KpiResultSchema.index({ userId: 1, kpiId: 1, periodStart: 1, periodEnd: 1 }, { unique: true });
exports.KpiResultSchema.index({ userId: 1, periodEnd: 1 });
exports.KpiResultSchema.index({ kpiId: 1 });
//# sourceMappingURL=kpi-result.schema.js.map