"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const projects_module_1 = require("./projects/projects.module");
const attendance_module_1 = require("./attendance/attendance.module");
const leave_module_1 = require("./leave/leave.module");
const daily_updates_module_1 = require("./daily-updates/daily-updates.module");
const kpi_module_1 = require("./kpi/kpi.module");
const analytics_module_1 = require("./analytics/analytics.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => ({
                    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/team_management',
                    serverSelectionTimeoutMS: 10000,
                    connectTimeoutMS: 10000,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            attendance_module_1.AttendanceModule,
            leave_module_1.LeaveModule,
            daily_updates_module_1.DailyUpdatesModule,
            kpi_module_1.KpiModule,
            analytics_module_1.AnalyticsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [{ provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map