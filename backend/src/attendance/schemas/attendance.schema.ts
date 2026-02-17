import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AttendanceStatus } from '../../common/enums';

@Schema({ timestamps: true })
export class Attendance extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop()
  checkIn: Date;

  @Prop()
  checkOut: Date;

  @Prop({ type: String, enum: AttendanceStatus })
  status: AttendanceStatus;

  @Prop({ default: false })
  adminOverride: boolean;

  @Prop()
  adminOverrideReason: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  overriddenBy: Types.ObjectId;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ status: 1, date: 1 });
