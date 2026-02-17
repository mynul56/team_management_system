import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in-out.dto';
import { OverrideAttendanceDto } from './dto/override-attendance.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  checkIn(@CurrentUser('sub') userId: string, @Body() dto: CheckInDto) {
    return this.attendanceService.checkIn(userId, dto.timestamp);
  }

  @Post('check-out')
  checkOut(@CurrentUser('sub') userId: string, @Body() dto: CheckInDto) {
    return this.attendanceService.checkOut(userId, dto.timestamp);
  }

  @Get('me')
  getMyAttendance(
    @CurrentUser('sub') userId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.attendanceService.getMyAttendance(userId, from, to);
  }

  @Get('me/today')
  getToday(@CurrentUser('sub') userId: string) {
    return this.attendanceService.getToday(userId);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  adminList(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.attendanceService.adminList({
      from,
      to,
      userId,
      status: status as import('../common/enums').AttendanceStatus | undefined,
    });
  }

  @Put('admin/:id/override')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  adminOverride(
    @CurrentUser('sub') adminId: string,
    @Param('id') attendanceId: string,
    @Body() dto: OverrideAttendanceDto,
  ) {
    return this.attendanceService.adminOverride(adminId, attendanceId, dto.status, dto.reason);
  }
}
