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
exports.KpiService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const kpi_schema_1 = require("./schemas/kpi.schema");
const kpi_result_schema_1 = require("./schemas/kpi-result.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const attendance_schema_1 = require("../attendance/schemas/attendance.schema");
const daily_update_schema_1 = require("../daily-updates/schemas/daily-update.schema");
const enums_1 = require("../common/enums");
const enums_2 = require("../common/enums");
let KpiService = class KpiService {
    constructor(kpiModel, kpiResultModel, userModel, attendanceModel, dailyUpdateModel) {
        this.kpiModel = kpiModel;
        this.kpiResultModel = kpiResultModel;
        this.userModel = userModel;
        this.attendanceModel = attendanceModel;
        this.dailyUpdateModel = dailyUpdateModel;
    }
    async create(dto) {
        const kpi = await this.kpiModel.create({
            ...dto,
            measurementType: dto.measurementType ?? enums_1.KpiMeasurementType.MANUAL,
        });
        return kpi.toObject();
    }
    async findAll(filters) {
        const q = {};
        if (filters?.position)
            q.positions = filters.position;
        if (filters?.seniority)
            q.seniorities = filters.seniority;
        return this.kpiModel.find(q).sort({ name: 1 }).lean();
    }
    async findOne(id) {
        const kpi = await this.kpiModel.findById(id).lean();
        if (!kpi)
            throw new common_1.NotFoundException('KPI not found');
        return kpi;
    }
    async update(id, dto) {
        const kpi = await this.kpiModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean();
        if (!kpi)
            throw new common_1.NotFoundException('KPI not found');
        return kpi;
    }
    async remove(id) {
        const kpi = await this.kpiModel.findByIdAndDelete(id);
        if (!kpi)
            throw new common_1.NotFoundException('KPI not found');
        await this.kpiResultModel.deleteMany({ kpiId: id });
        return { message: 'KPI deleted' };
    }
    appliesToUser(kpi, user) {
        if (kpi.positions?.length && !kpi.positions.includes(user.position))
            return false;
        if (kpi.seniorities?.length && !kpi.seniorities.includes(user.seniority))
            return false;
        return true;
    }
    async getMyKpis(userId, periodStart, periodEnd) {
        const user = await this.userModel.findById(userId).lean();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const kpis = await this.kpiModel.find({}).lean();
        const applicable = kpis.filter((k) => this.appliesToUser(k, user));
        const results = await this.kpiResultModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            periodStart: { $gte: new Date(periodStart) },
            periodEnd: { $lte: new Date(periodEnd) },
        })
            .lean();
        const byKpi = new Map();
        for (const r of results)
            byKpi.set(r.kpiId.toString(), r);
        return applicable.map((k) => ({
            kpi: k,
            result: byKpi.get(k._id.toString()) ?? null,
        }));
    }
    async adminUpsertResult(adminId, userId, kpiId, dto) {
        const existing = await this.kpiResultModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            kpiId: new mongoose_2.Types.ObjectId(kpiId),
            periodStart: new Date(dto.periodStart),
            periodEnd: new Date(dto.periodEnd),
        });
        const payload = {
            userId: new mongoose_2.Types.ObjectId(userId),
            kpiId: new mongoose_2.Types.ObjectId(kpiId),
            periodStart: new Date(dto.periodStart),
            periodEnd: new Date(dto.periodEnd),
            score: dto.score,
            adminFeedback: dto.adminFeedback,
            bonusAmount: dto.bonusAmount,
            currency: dto.currency || 'USD',
            isAutoCalculated: false,
            updatedBy: new mongoose_2.Types.ObjectId(adminId),
        };
        if (existing) {
            await this.kpiResultModel.updateOne({ _id: existing._id }, { $set: payload });
            return this.kpiResultModel.findById(existing._id).lean();
        }
        const created = await this.kpiResultModel.create(payload);
        return created.toObject();
    }
    async computeAttendanceKpi(userId, periodStart, periodEnd) {
        const records = await this.attendanceModel.find({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: periodStart, $lte: periodEnd },
        }).lean();
        if (records.length === 0)
            return 0;
        const workingDays = records.length;
        const presentOrLate = records.filter((r) => r.status === enums_2.AttendanceStatus.PRESENT || r.status === enums_2.AttendanceStatus.LATE).length;
        const halfDay = records.filter((r) => r.status === enums_2.AttendanceStatus.HALF_DAY).length;
        const score = (presentOrLate * 100 + halfDay * 50) / workingDays;
        return Math.min(100, Math.round(score * 100) / 100);
    }
    async computeDailyUpdateKpi(userId, periodStart, periodEnd) {
        const totalDays = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        const submitted = await this.dailyUpdateModel.distinct('date', {
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: periodStart, $lte: periodEnd },
        });
        const rate = totalDays > 0 ? (submitted.length / totalDays) * 100 : 0;
        return Math.min(100, Math.round(rate * 100) / 100);
    }
    async recalculateAutoKpis(userId, periodStart, periodEnd) {
        const start = new Date(periodStart);
        const end = new Date(periodEnd);
        const kpis = await this.kpiModel.find({ measurementType: enums_1.KpiMeasurementType.AUTO }).lean();
        const user = await this.userModel.findById(userId).lean();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const results = [];
        for (const kpi of kpis) {
            if (!this.appliesToUser(kpi, user))
                continue;
            const name = kpi.name.toLowerCase();
            let score = 0;
            if (name.includes('attendance'))
                score = await this.computeAttendanceKpi(userId, start, end);
            else if (name.includes('daily') || name.includes('update'))
                score = await this.computeDailyUpdateKpi(userId, start, end);
            if (score > 0) {
                await this.kpiResultModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId), kpiId: kpi._id, periodStart: start, periodEnd: end }, {
                    $set: {
                        userId: new mongoose_2.Types.ObjectId(userId),
                        kpiId: kpi._id,
                        periodStart: start,
                        periodEnd: end,
                        score,
                        isAutoCalculated: true,
                    },
                }, { upsert: true });
                results.push({ kpiId: kpi._id.toString(), score });
            }
        }
        return results;
    }
};
exports.KpiService = KpiService;
exports.KpiService = KpiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(kpi_schema_1.Kpi.name)),
    __param(1, (0, mongoose_1.InjectModel)(kpi_result_schema_1.KpiResult.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(4, (0, mongoose_1.InjectModel)(daily_update_schema_1.DailyUpdate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], KpiService);
//# sourceMappingURL=kpi.service.js.map