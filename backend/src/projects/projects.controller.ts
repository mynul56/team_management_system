import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignMembersDto } from './dto/assign-members.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Query('status') status?: string): Promise<Record<string, unknown>[]> {
    return this.projectsService.findAll({ status });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Record<string, unknown>> {
    return this.projectsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateProjectDto): Promise<Record<string, unknown>> {
    return this.projectsService.create(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Put(':id/assignments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  assignMembers(@Param('id') id: string, @Body() dto: AssignMembersDto): Promise<Record<string, unknown>> {
    return this.projectsService.assignMembers(id, dto);
  }
}
