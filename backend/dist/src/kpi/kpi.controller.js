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
exports.KpiController = void 0;
const common_1 = require("@nestjs/common");
const kpi_service_1 = require("./kpi.service");
const create_kpi_dto_1 = require("./dto/create-kpi.dto");
const update_kpi_dto_1 = require("./dto/update-kpi.dto");
const upsert_kpi_result_dto_1 = require("./dto/upsert-kpi-result.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const enums_1 = require("../common/enums");
let KpiController = class KpiController {
    constructor(kpiService) {
        this.kpiService = kpiService;
    }
    getMyKpis(userId, periodStart, periodEnd) {
        return this.kpiService.getMyKpis(userId, periodStart, periodEnd);
    }
    findAll(position, seniority) {
        return this.kpiService.findAll({ position, seniority });
    }
    findOne(id) {
        return this.kpiService.findOne(id);
    }
    create(dto) {
        return this.kpiService.create(dto);
    }
    update(id, dto) {
        return this.kpiService.update(id, dto);
    }
    remove(id) {
        return this.kpiService.remove(id);
    }
    upsertResult(adminId, userId, kpiId, dto) {
        return this.kpiService.adminUpsertResult(adminId, userId, kpiId, dto);
    }
    recalculate(userId, periodStart, periodEnd) {
        return this.kpiService.recalculateAutoKpis(userId, periodStart, periodEnd);
    }
};
exports.KpiController = KpiController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('periodStart')),
    __param(2, (0, common_1.Query)('periodEnd')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], KpiController.prototype, "getMyKpis", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('position')),
    __param(1, (0, common_1.Query)('seniority')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], KpiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KpiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kpi_dto_1.CreateKpiDto]),
    __metadata("design:returntype", void 0)
], KpiController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kpi_dto_1.UpdateKpiDto]),
    __metadata("design:returntype", void 0)
], KpiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KpiController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('result'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('kpiId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, upsert_kpi_result_dto_1.UpsertKpiResultDto]),
    __metadata("design:returntype", void 0)
], KpiController.prototype, "upsertResult", null);
__decorate([
    (0, common_1.Post)('recalculate'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('periodStart')),
    __param(2, (0, common_1.Query)('periodEnd')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], KpiController.prototype, "recalculate", null);
exports.KpiController = KpiController = __decorate([
    (0, common_1.Controller)('kpi'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [kpi_service_1.KpiService])
], KpiController);
//# sourceMappingURL=kpi.controller.js.map