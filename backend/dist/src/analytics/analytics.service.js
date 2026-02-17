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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_log_schema_1 = require("../common/schemas/audit-log.schema");
const attendance_schema_1 = require("../attendance/schemas/attendance.schema");
const leave_schema_1 = require("../leave/schemas/leave.schema");
const daily_update_schema_1 = require("../daily-updates/schemas/daily-update.schema");
const project_schema_1 = require("../projects/schemas/project.schema");
const project_assignment_schema_1 = require("../projects/schemas/project-assignment.schema");
const kpi_result_schema_1 = require("../kpi/schemas/kpi-result.schema");
const enums_1 = require("../common/enums");
let AnalyticsService = class AnalyticsService {
    constructor(auditLogModel, attendanceModel, leaveModel, dailyUpdateModel, projectModel, assignmentModel, kpiResultModel) {
        this.auditLogModel = auditLogModel;
        this.attendanceModel = attendanceModel;
        this.leaveModel = leaveModel;
        this.dailyUpdateModel = dailyUpdateModel;
        this.projectModel = projectModel;
        this.assignmentModel = assignmentModel;
        this.kpiResultModel = kpiResultModel;
    }
    async logAction(performedBy, action, resource, meta, ip) {
        await this.auditLogModel.create({
            performedBy: new mongoose_2.Types.ObjectId(performedBy),
            action,
            resource,
            meta,
            ip,
        });
    }
    async dashboard(from, to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const [attendanceOverview, projectHealth, blockersCount, kpiSummary] = await Promise.all([
            this.attendanceOverview(fromDate, toDate),
            this.projectHealth(),
            this.dailyUpdateModel.countDocuments({
                date: { $gte: fromDate, $lte: toDate },
                blockers: { $exists: true, $ne: '', $regex: /\S/ },
            }),
            this.kpiSummary(fromDate, toDate),
        ]);
        return {
            attendanceOverview,
            projectHealth,
            blockersCount,
            kpiSummary,
            dateRange: { from, to },
        };
    }
    async attendanceOverview(from, to) {
        const records = await this.attendanceModel
            .find({ date: { $gte: from, $lte: to } })
            .lean();
        const byStatus = {};
        for (const r of records) {
            const s = r.status || 'absent';
            byStatus[s] = (byStatus[s] || 0) + 1;
        }
        const byDate = new Map();
        for (const r of records) {
            const d = r.date.toISOString().split('T')[0];
            if (!byDate.has(d))
                byDate.set(d, { present: 0, late: 0, half_day: 0, leave: 0, absent: 0 });
            const map = byDate.get(d);
            const key = r.status === enums_1.AttendanceStatus.PRESENT ? 'present' : r.status === enums_1.AttendanceStatus.LATE ? 'late' : r.status === enums_1.AttendanceStatus.HALF_DAY ? 'half_day' : r.status === enums_1.AttendanceStatus.LEAVE ? 'leave' : 'absent';
            map[key] = (map[key] || 0) + 1;
        }
        return { byStatus, byDate: Object.fromEntries(byDate) };
    }
    async projectHealth() {
        const projects = await this.projectModel.find({}).lean();
        const assignments = await this.assignmentModel.aggregate([
            { $group: { _id: '$projectId', count: { $sum: 1 } } },
        ]);
        const byProject = new Map(assignments.map((a) => [a._id.toString(), a.count]));
        return projects.map((p) => ({
            _id: p._id,
            name: p.name,
            status: p.status,
            deadline: p.deadline,
            memberCount: byProject.get(p._id.toString()) || 0,
        }));
    }
    async kpiSummary(from, to) {
        const results = await this.kpiResultModel
            .find({
            periodStart: { $gte: from },
            periodEnd: { $lte: to },
        })
            .populate('userId', 'name position seniority')
            .lean();
        const byUser = new Map();
        for (const r of results) {
            const uid = r.userId._id.toString();
            if (!byUser.has(uid))
                byUser.set(uid, { total: 0, count: 0 });
            const u = byUser.get(uid);
            u.total += r.score;
            u.count += 1;
        }
        return Array.from(byUser.entries()).map(([userId, { total, count }]) => ({
            userId,
            averageScore: count > 0 ? Math.round((total / count) * 100) / 100 : 0,
            resultCount: count,
        }));
    }
    async roleWiseWorkload() {
        const assignments = await this.assignmentModel
            .aggregate([
            { $group: { _id: { userId: '$userId', role: '$role' }, count: { $sum: 1 } } },
            { $group: { _id: '$_id.role', totalAssignments: { $sum: '$count' }, userCount: { $sum: 1 } } },
        ]);
        return assignments;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __param(1, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(2, (0, mongoose_1.InjectModel)(leave_schema_1.Leave.name)),
    __param(3, (0, mongoose_1.InjectModel)(daily_update_schema_1.DailyUpdate.name)),
    __param(4, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __param(5, (0, mongoose_1.InjectModel)(project_assignment_schema_1.ProjectAssignment.name)),
    __param(6, (0, mongoose_1.InjectModel)(kpi_result_schema_1.KpiResult.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map