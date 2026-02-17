import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { UpsertKpiResultDto } from './dto/upsert-kpi-result.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@Controller('kpi')
@UseGuards(JwtAuthGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('me')
  getMyKpis(
    @CurrentUser('sub') userId: string,
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    return this.kpiService.getMyKpis(userId, periodStart, periodEnd);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query('position') position?: string, @Query('seniority') seniority?: string) {
    return this.kpiService.findAll({ position, seniority });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.kpiService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateKpiDto) {
    return this.kpiService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateKpiDto) {
    return this.kpiService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.kpiService.remove(id);
  }

  @Post('result')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  upsertResult(
    @CurrentUser('sub') adminId: string,
    @Query('userId') userId: string,
    @Query('kpiId') kpiId: string,
    @Body() dto: UpsertKpiResultDto,
  ) {
    return this.kpiService.adminUpsertResult(adminId, userId, kpiId, dto);
  }

  @Post('recalculate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  recalculate(
    @Query('userId') userId: string,
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    return this.kpiService.recalculateAutoKpis(userId, periodStart, periodEnd);
  }
}
