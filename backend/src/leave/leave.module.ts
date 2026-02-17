import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Leave, LeaveSchema } from './schemas/leave.schema';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Leave.name, schema: LeaveSchema }]), AuthModule],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule { }
