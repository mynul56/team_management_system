import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from '../common/schemas/audit-log.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';
import { ProjectAssignment, ProjectAssignmentSchema } from '../projects/schemas/project-assignment.schema';
import { Attendance, AttendanceSchema } from '../attendance/schemas/attendance.schema';
import { Leave, LeaveSchema } from '../leave/schemas/leave.schema';
import { DailyUpdate, DailyUpdateSchema } from '../daily-updates/schemas/daily-update.schema';
import { KpiResult, KpiResultSchema } from '../kpi/schemas/kpi-result.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectAssignment.name, schema: ProjectAssignmentSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Leave.name, schema: LeaveSchema },
      { name: DailyUpdate.name, schema: DailyUpdateSchema },
      { name: KpiResult.name, schema: KpiResultSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
