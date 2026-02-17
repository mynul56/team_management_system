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
exports.DailyUpdatesController = void 0;
const common_1 = require("@nestjs/common");
const daily_updates_service_1 = require("./daily-updates.service");
const create_daily_update_dto_1 = require("./dto/create-daily-update.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const enums_1 = require("../common/enums");
let DailyUpdatesController = class DailyUpdatesController {
    constructor(dailyUpdatesService) {
        this.dailyUpdatesService = dailyUpdatesService;
    }
    submit(userId, date, dto) {
        const d = date || new Date().toISOString().split('T')[0];
        return this.dailyUpdatesService.submit(userId, d, dto);
    }
    getMyUpdates(userId, from, to) {
        return this.dailyUpdatesService.getMyUpdates(userId, from, to);
    }
    adminListByDate(date) {
        return this.dailyUpdatesService.adminListByDate(date);
    }
    adminBlockers(from, to) {
        return this.dailyUpdatesService.adminListBlockers(from, to);
    }
    submissionStatus(date) {
        return this.dailyUpdatesService.adminSubmissionStatus(date);
    }
};
exports.DailyUpdatesController = DailyUpdatesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_daily_update_dto_1.CreateDailyUpdateDto]),
    __metadata("design:returntype", void 0)
], DailyUpdatesController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DailyUpdatesController.prototype, "getMyUpdates", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DailyUpdatesController.prototype, "adminListByDate", null);
__decorate([
    (0, common_1.Get)('admin/blockers'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DailyUpdatesController.prototype, "adminBlockers", null);
__decorate([
    (0, common_1.Get)('admin/submission-status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DailyUpdatesController.prototype, "submissionStatus", null);
exports.DailyUpdatesController = DailyUpdatesController = __decorate([
    (0, common_1.Controller)('daily-updates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [daily_updates_service_1.DailyUpdatesService])
], DailyUpdatesController);
//# sourceMappingURL=daily-updates.controller.js.map