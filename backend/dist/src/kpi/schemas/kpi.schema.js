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
exports.KpiSchema = exports.Kpi = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
const enums_2 = require("../../common/enums");
let Kpi = class Kpi extends mongoose_2.Document {
};
exports.Kpi = Kpi;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Kpi.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, max: 100 }),
    __metadata("design:type", Number)
], Kpi.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['auto', 'manual'], default: 'manual' }),
    __metadata("design:type", String)
], Kpi.prototype, "measurementType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: Object.values(enums_1.Position) }),
    __metadata("design:type", Array)
], Kpi.prototype, "positions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: Object.values(enums_1.Seniority) }),
    __metadata("design:type", Array)
], Kpi.prototype, "seniorities", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Kpi.prototype, "description", void 0);
exports.Kpi = Kpi = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Kpi);
exports.KpiSchema = mongoose_1.SchemaFactory.createForClass(Kpi);
exports.KpiSchema.index({ measurementType: 1 });
//# sourceMappingURL=kpi.schema.js.map