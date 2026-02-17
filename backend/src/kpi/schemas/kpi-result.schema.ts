import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class KpiResult extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Kpi', required: true })
  kpiId: Types.ObjectId;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;

  @Prop({ min: 0, max: 100 })
  score: number;

  @Prop()
  adminFeedback: string;

  @Prop()
  bonusAmount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: false })
  isAutoCalculated: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const KpiResultSchema = SchemaFactory.createForClass(KpiResult);
KpiResultSchema.index({ userId: 1, kpiId: 1, periodStart: 1, periodEnd: 1 }, { unique: true });
KpiResultSchema.index({ userId: 1, periodEnd: 1 });
KpiResultSchema.index({ kpiId: 1 });
