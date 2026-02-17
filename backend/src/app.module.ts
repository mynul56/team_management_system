import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { DailyUpdatesModule } from './daily-updates/daily-updates.module';
import { KpiModule } from './kpi/kpi.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/team_management',
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      }),
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    AttendanceModule,
    LeaveModule,
    DailyUpdatesModule,
    KpiModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule { }
