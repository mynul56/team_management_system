import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Kpi, KpiSchema } from './schemas/kpi.schema';
import { KpiResult, KpiResultSchema } from './schemas/kpi-result.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Attendance, AttendanceSchema } from '../attendance/schemas/attendance.schema';
import { DailyUpdate, DailyUpdateSchema } from '../daily-updates/schemas/daily-update.schema';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Kpi.name, schema: KpiSchema },
      { name: KpiResult.name, schema: KpiResultSchema },
      { name: User.name, schema: UserSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: DailyUpdate.name, schema: DailyUpdateSchema },
    ]),
  ],
  controllers: [KpiController],
  providers: [KpiService],
  exports: [KpiService],
})
export class KpiModule {}
