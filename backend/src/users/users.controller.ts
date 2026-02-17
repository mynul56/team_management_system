import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser('sub') userId: string): Promise<Record<string, unknown>> {
    return this.usersService.getProfile(userId);
  }

  @Put('me')
  updateProfile(@CurrentUser('sub') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('role') role?: UserRole,
    @Query('position') position?: string,
    @Query('seniority') seniority?: string,
    @Query('pending') pending?: string,
  ) {
    return this.usersService.findAllAdmin({
      role,
      position,
      seniority,
      pending: pending === 'true',
    });
  }

  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  approve(@Param('id') id: string) {
    return this.usersService.approveUser(id);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateByAdmin(
    @CurrentUser('sub') adminId: string,
    @Param('id') targetUserId: string,
    @Body() dto: UpdateUserAdminDto,
  ) {
    return this.usersService.updateByAdmin(adminId, targetUserId, dto);
  }
}
