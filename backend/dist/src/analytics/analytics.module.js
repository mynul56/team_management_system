"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const audit_log_schema_1 = require("../common/schemas/audit-log.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const project_schema_1 = require("../projects/schemas/project.schema");
const project_assignment_schema_1 = require("../projects/schemas/project-assignment.schema");
const attendance_schema_1 = require("../attendance/schemas/attendance.schema");
const leave_schema_1 = require("../leave/schemas/leave.schema");
const daily_update_schema_1 = require("../daily-updates/schemas/daily-update.schema");
const kpi_result_schema_1 = require("../kpi/schemas/kpi-result.schema");
const analytics_controller_1 = require("./analytics.controller");
const analytics_service_1 = require("./analytics.service");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: project_schema_1.Project.name, schema: project_schema_1.ProjectSchema },
                { name: project_assignment_schema_1.ProjectAssignment.name, schema: project_assignment_schema_1.ProjectAssignmentSchema },
                { name: attendance_schema_1.Attendance.name, schema: attendance_schema_1.AttendanceSchema },
                { name: leave_schema_1.Leave.name, schema: leave_schema_1.LeaveSchema },
                { name: daily_update_schema_1.DailyUpdate.name, schema: daily_update_schema_1.DailyUpdateSchema },
                { name: kpi_result_schema_1.KpiResult.name, schema: kpi_result_schema_1.KpiResultSchema },
            ]),
        ],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map