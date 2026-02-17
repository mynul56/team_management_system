"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpiModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const kpi_schema_1 = require("./schemas/kpi.schema");
const kpi_result_schema_1 = require("./schemas/kpi-result.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const attendance_schema_1 = require("../attendance/schemas/attendance.schema");
const daily_update_schema_1 = require("../daily-updates/schemas/daily-update.schema");
const kpi_controller_1 = require("./kpi.controller");
const kpi_service_1 = require("./kpi.service");
let KpiModule = class KpiModule {
};
exports.KpiModule = KpiModule;
exports.KpiModule = KpiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: kpi_schema_1.Kpi.name, schema: kpi_schema_1.KpiSchema },
                { name: kpi_result_schema_1.KpiResult.name, schema: kpi_result_schema_1.KpiResultSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: attendance_schema_1.Attendance.name, schema: attendance_schema_1.AttendanceSchema },
                { name: daily_update_schema_1.DailyUpdate.name, schema: daily_update_schema_1.DailyUpdateSchema },
            ]),
        ],
        controllers: [kpi_controller_1.KpiController],
        providers: [kpi_service_1.KpiService],
        exports: [kpi_service_1.KpiService],
    })
], KpiModule);
//# sourceMappingURL=kpi.module.js.map