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
exports.DailyUpdateSchema = exports.DailyUpdate = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DailyUpdate = class DailyUpdate extends mongoose_2.Document {
};
exports.DailyUpdate = DailyUpdate;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DailyUpdate.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], DailyUpdate.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DailyUpdate.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DailyUpdate.prototype, "completedToday", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DailyUpdate.prototype, "inProgress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DailyUpdate.prototype, "blockers", void 0);
exports.DailyUpdate = DailyUpdate = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DailyUpdate);
exports.DailyUpdateSchema = mongoose_1.SchemaFactory.createForClass(DailyUpdate);
exports.DailyUpdateSchema.index({ userId: 1, date: 1 });
exports.DailyUpdateSchema.index({ date: 1 });
exports.DailyUpdateSchema.index({ projectId: 1, date: 1 });
//# sourceMappingURL=daily-update.schema.js.map