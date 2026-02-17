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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const leave_schema_1 = require("./schemas/leave.schema");
const enums_1 = require("../common/enums");
let LeaveService = class LeaveService {
    constructor(leaveModel) {
        this.leaveModel = leaveModel;
    }
    async create(userId, dto) {
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        if (end < start)
            throw new common_1.BadRequestException('endDate must be after startDate');
        const leave = await this.leaveModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            leaveType: dto.leaveType,
            startDate: start,
            endDate: end,
            reason: dto.reason,
            status: enums_1.LeaveStatus.PENDING,
        });
        return leave.toObject();
    }
    async getMyLeaves(userId, from, to) {
        const q = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (from)
            q.startDate = { $gte: new Date(from) };
        if (to)
            q.endDate = { $lte: new Date(to) };
        return this.leaveModel.find(q).sort({ startDate: -1 }).lean();
    }
    async adminList(filters) {
        const q = {};
        if (filters?.status)
            q.status = filters.status;
        if (filters?.userId)
            q.userId = new mongoose_2.Types.ObjectId(filters.userId);
        return this.leaveModel
            .find(q)
            .populate('userId', 'name email position seniority')
            .sort({ createdAt: -1 })
            .lean();
    }
    async review(adminId, leaveId, dto) {
        const leave = await this.leaveModel.findByIdAndUpdate(leaveId, {
            $set: {
                status: dto.status,
                reviewedBy: new mongoose_2.Types.ObjectId(adminId),
                reviewedAt: new Date(),
                reviewNote: dto.reviewNote,
            },
        }, { new: true })
            .populate('userId', 'name email')
            .lean();
        if (!leave)
            throw new common_1.NotFoundException('Leave request not found');
        return leave;
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(leave_schema_1.Leave.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LeaveService);
//# sourceMappingURL=leave.service.js.map