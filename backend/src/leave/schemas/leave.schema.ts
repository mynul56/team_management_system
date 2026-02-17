import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LeaveType, LeaveStatus } from '../../common/enums';

@Schema({ timestamps: true })
export class Leave extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: LeaveType, required: true })
  leaveType: LeaveType;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  reason: string;

  @Prop({ type: String, enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId;

  @Prop()
  reviewedAt: Date;

  @Prop()
  reviewNote: string;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
LeaveSchema.index({ userId: 1, startDate: 1 });
LeaveSchema.index({ status: 1 });
LeaveSchema.index({ startDate: 1, endDate: 1 });
