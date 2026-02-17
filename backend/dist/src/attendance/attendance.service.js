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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attendance_schema_1 = require("./schemas/attendance.schema");
const leave_schema_1 = require("../leave/schemas/leave.schema");
const enums_1 = require("../common/enums");
const LATE_THRESHOLD_HOUR = 10;
const LATE_THRESHOLD_MINUTE = 0;
const HALF_DAY_MIN_HOURS = 4;
let AttendanceService = class AttendanceService {
    constructor(attendanceModel, leaveModel) {
        this.attendanceModel = attendanceModel;
        this.leaveModel = leaveModel;
    }
    toDateOnly(d) {
        const x = new Date(d);
        x.setUTCHours(0, 0, 0, 0);
        return x;
    }
    computeStatus(checkIn, checkOut, onLeave) {
        if (onLeave)
            return enums_1.AttendanceStatus.LEAVE;
        if (!checkIn)
            return enums_1.AttendanceStatus.ABSENT;
        const lateCutoff = new Date(checkIn);
        lateCutoff.setHours(LATE_THRESHOLD_HOUR, LATE_THRESHOLD_MINUTE, 0, 0);
        const isLate = checkIn > lateCutoff;
        if (!checkOut)
            return isLate ? enums_1.AttendanceStatus.LATE : enums_1.AttendanceStatus.PRESENT;
        const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        if (hours < HALF_DAY_MIN_HOURS)
            return enums_1.AttendanceStatus.HALF_DAY;
        return isLate ? enums_1.AttendanceStatus.LATE : enums_1.AttendanceStatus.PRESENT;
    }
    async hasApprovedLeave(userId, date) {
        const start = this.toDateOnly(date);
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 1);
        const leave = await this.leaveModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            status: enums_1.LeaveStatus.APPROVED,
            $or: [
                { startDate: { $lt: end }, endDate: { $gte: start } },
            ],
        });
        return !!leave;
    }
    async checkIn(userId, timestamp) {
        const now = new Date(timestamp || Date.now());
        const date = this.toDateOnly(now);
        const existing = await this.attendanceModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
        });
        if (existing?.checkIn)
            throw new common_1.BadRequestException('Already checked in today');
        const onLeave = await this.hasApprovedLeave(userId, date);
        const status = onLeave
            ? enums_1.AttendanceStatus.LEAVE
            : this.computeStatus(now, null, false);
        const att = await this.attendanceModel.findOneAndUpdate({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
        }, {
            $set: {
                userId: new mongoose_2.Types.ObjectId(userId),
                date,
                checkIn: now,
                status,
                adminOverride: false,
            },
        }, { upsert: true, new: true });
        return att.toObject();
    }
    async checkOut(userId, timestamp) {
        const now = new Date(timestamp || Date.now());
        const date = this.toDateOnly(now);
        const att = await this.attendanceModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
        });
        if (!att)
            throw new common_1.BadRequestException('No check-in found for today');
        if (att.checkOut)
            throw new common_1.BadRequestException('Already checked out');
        const onLeave = await this.hasApprovedLeave(userId, date);
        const status = att.adminOverride
            ? att.status
            : this.computeStatus(att.checkIn, now, onLeave);
        att.checkOut = now;
        att.status = status;
        await att.save();
        return att.toObject();
    }
    async getMyAttendance(userId, from, to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        return this.attendanceModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: fromDate, $lte: toDate },
        })
            .sort({ date: -1 })
            .lean();
    }
    async getToday(userId) {
        const today = this.toDateOnly(new Date());
        const end = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        return this.attendanceModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: today, $lt: end },
        })
            .lean();
    }
    async adminList(filters) {
        const q = {
            date: { $gte: new Date(filters.from), $lte: new Date(filters.to) },
        };
        if (filters.userId)
            q.userId = new mongoose_2.Types.ObjectId(filters.userId);
        if (filters.status)
            q.status = filters.status;
        return this.attendanceModel
            .find(q)
            .populate('userId', 'name email position seniority')
            .sort({ date: -1 })
            .lean();
    }
    async adminOverride(adminId, attendanceId, status, reason) {
        const att = await this.attendanceModel.findByIdAndUpdate(attendanceId, {
            $set: {
                status,
                adminOverride: true,
                adminOverrideReason: reason,
                overriddenBy: new mongoose_2.Types.ObjectId(adminId),
            },
        }, { new: true });
        if (!att)
            throw new common_1.NotFoundException('Attendance record not found');
        return att.toObject();
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(1, (0, mongoose_1.InjectModel)(leave_schema_1.Leave.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map