import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DailyUpdatesService } from './daily-updates.service';
import { CreateDailyUpdateDto } from './dto/create-daily-update.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@Controller('daily-updates')
@UseGuards(JwtAuthGuard)
export class DailyUpdatesController {
  constructor(private readonly dailyUpdatesService: DailyUpdatesService) {}

  @Post()
  submit(
    @CurrentUser('sub') userId: string,
    @Query('date') date: string,
    @Body() dto: CreateDailyUpdateDto,
  ) {
    const d = date || new Date().toISOString().split('T')[0];
    return this.dailyUpdatesService.submit(userId, d, dto);
  }

  @Get('me')
  getMyUpdates(
    @CurrentUser('sub') userId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.dailyUpdatesService.getMyUpdates(userId, from, to);
  }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  adminListByDate(@Query('date') date: string) {
    return this.dailyUpdatesService.adminListByDate(date);
  }

  @Get('admin/blockers')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  adminBlockers(@Query('from') from: string, @Query('to') to: string) {
    return this.dailyUpdatesService.adminListBlockers(from, to);
  }

  @Get('admin/submission-status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  submissionStatus(@Query('date') date: string) {
    return this.dailyUpdatesService.adminSubmissionStatus(date);
  }
}
