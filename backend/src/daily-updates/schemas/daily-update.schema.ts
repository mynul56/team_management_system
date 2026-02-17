import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DailyUpdate extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  completedToday: string;

  @Prop({ required: true })
  inProgress: string;

  @Prop()
  blockers: string;
}

export const DailyUpdateSchema = SchemaFactory.createForClass(DailyUpdate);
DailyUpdateSchema.index({ userId: 1, date: 1 });
DailyUpdateSchema.index({ date: 1 });
DailyUpdateSchema.index({ projectId: 1, date: 1 });
