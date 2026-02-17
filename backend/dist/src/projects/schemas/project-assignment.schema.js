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
exports.ProjectAssignmentSchema = exports.ProjectAssignment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
let ProjectAssignment = class ProjectAssignment extends mongoose_2.Document {
};
exports.ProjectAssignment = ProjectAssignment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Project', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProjectAssignment.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProjectAssignment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: enums_1.ProjectRole, required: true }),
    __metadata("design:type", String)
], ProjectAssignment.prototype, "role", void 0);
exports.ProjectAssignment = ProjectAssignment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProjectAssignment);
exports.ProjectAssignmentSchema = mongoose_1.SchemaFactory.createForClass(ProjectAssignment);
exports.ProjectAssignmentSchema.index({ projectId: 1, userId: 1, role: 1 }, { unique: true });
exports.ProjectAssignmentSchema.index({ userId: 1 });
exports.ProjectAssignmentSchema.index({ projectId: 1 });
//# sourceMappingURL=project-assignment.schema.js.map