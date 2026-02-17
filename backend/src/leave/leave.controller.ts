import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ReviewLeaveDto } from './dto/review-leave.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@Controller('leave')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateLeaveDto) {
    return this.leaveService.create(userId, dto);
  }

  @Get('me')
  getMyLeaves(
    @CurrentUser('sub') userId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.leaveService.getMyLeaves(userId, from, to);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  adminList(@Query('status') status?: string, @Query('userId') userId?: string) {
    return this.leaveService.adminList({
      status: status as import('../common/enums').LeaveStatus | undefined,
      userId,
    });
  }

  @Put('admin/:id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  review(
    @CurrentUser('sub') adminId: string,
    @Param('id') leaveId: string,
    @Body() dto: ReviewLeaveDto,
  ) {
    return this.leaveService.review(adminId, leaveId, dto);
  }
}
