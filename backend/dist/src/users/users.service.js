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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const project_assignment_schema_1 = require("../projects/schemas/project-assignment.schema");
let UsersService = class UsersService {
    constructor(userModel, assignmentModel) {
        this.userModel = userModel;
        this.assignmentModel = assignmentModel;
    }
    async findById(id) {
        const user = await this.userModel.findById(id).select('-passwordHash').lean();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId).select('-passwordHash').lean();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const assignments = await this.assignmentModel
            .find({ userId: user._id })
            .populate('projectId', 'name client status deadline')
            .lean();
        return { ...user, assignedProjects: assignments };
    }
    async updateProfile(userId, dto) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: dto }, { new: true }).select('-passwordHash');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findAllAdmin(filters) {
        const q = {};
        if (filters?.role)
            q.role = filters.role;
        if (filters?.position)
            q.position = filters.position;
        if (filters?.seniority)
            q.seniority = filters.seniority;
        if (filters?.pending === true)
            q.isActive = false;
        return this.userModel.find(q).select('-passwordHash').sort({ name: 1 }).lean();
    }
    async approveUser(userId) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: { isActive: true } }, { new: true }).select('-passwordHash');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateByAdmin(adminId, targetUserId, dto) {
        const user = await this.userModel.findByIdAndUpdate(targetUserId, { $set: dto }, { new: true }).select('-passwordHash');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async remove(id) {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.assignmentModel.deleteMany({ userId: id });
        return { message: 'User deleted' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_assignment_schema_1.ProjectAssignment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map