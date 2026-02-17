import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Position, Seniority } from '../../common/enums';
import { KpiMeasurementType } from '../../common/enums';

@Schema({ timestamps: true })
export class Kpi extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0, max: 100 })
  weight: number;

  @Prop({ type: String, enum: ['auto', 'manual'], default: 'manual' })
  measurementType: KpiMeasurementType;

  @Prop({ type: [String], enum: Object.values(Position) })
  positions: Position[];

  @Prop({ type: [String], enum: Object.values(Seniority) })
  seniorities: Seniority[];

  @Prop()
  description: string;
}

export const KpiSchema = SchemaFactory.createForClass(Kpi);
KpiSchema.index({ measurementType: 1 });
