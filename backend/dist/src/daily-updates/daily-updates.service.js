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
exports.DailyUpdatesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const daily_update_schema_1 = require("./schemas/daily-update.schema");
let DailyUpdatesService = class DailyUpdatesService {
    constructor(dailyUpdateModel) {
        this.dailyUpdateModel = dailyUpdateModel;
    }
    async submit(userId, date, dto) {
        const d = new Date(date);
        d.setUTCHours(0, 0, 0, 0);
        const existing = await this.dailyUpdateModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: d,
            projectId: new mongoose_2.Types.ObjectId(dto.projectId),
        });
        if (existing) {
            existing.completedToday = dto.completedToday;
            existing.inProgress = dto.inProgress;
            existing.blockers = dto.blockers ?? '';
            await existing.save();
            return existing.toObject();
        }
        const update = await this.dailyUpdateModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: d,
            projectId: new mongoose_2.Types.ObjectId(dto.projectId),
            completedToday: dto.completedToday,
            inProgress: dto.inProgress,
            blockers: dto.blockers ?? '',
        });
        return update.toObject();
    }
    async getMyUpdates(userId, from, to) {
        return this.dailyUpdateModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: new Date(from), $lte: new Date(to) },
        })
            .populate('projectId', 'name client')
            .sort({ date: -1 })
            .lean();
    }
    async adminListByDate(date) {
        const d = new Date(date);
        d.setUTCHours(0, 0, 0, 0);
        const end = new Date(d.getTime() + 24 * 60 * 60 * 1000);
        const updates = await this.dailyUpdateModel
            .find({ date: { $gte: d, $lt: end } })
            .populate('userId', 'name email position seniority')
            .populate('projectId', 'name client')
            .sort({ createdAt: -1 })
            .lean();
        return updates;
    }
    async adminListBlockers(from, to) {
        const updates = await this.dailyUpdateModel
            .find({
            date: { $gte: new Date(from), $lte: new Date(to) },
            blockers: { $exists: true, $ne: '', $regex: /\S/ },
        })
            .populate('userId', 'name email')
            .populate('projectId', 'name')
            .sort({ date: -1 })
            .lean();
        return updates;
    }
    async adminSubmissionStatus(date) {
        const d = new Date(date);
        d.setUTCHours(0, 0, 0, 0);
        const end = new Date(d.getTime() + 24 * 60 * 60 * 1000);
        const submittedUserIds = await this.dailyUpdateModel
            .distinct('userId', { date: { $gte: d, $lt: end } });
        return { date, submittedUserIds: submittedUserIds.map((id) => id.toString()) };
    }
};
exports.DailyUpdatesService = DailyUpdatesService;
exports.DailyUpdatesService = DailyUpdatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(daily_update_schema_1.DailyUpdate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DailyUpdatesService);
//# sourceMappingURL=daily-updates.service.js.map