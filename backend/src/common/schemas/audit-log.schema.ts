import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ required: true })
  action: string;

  @Prop()
  resource: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  performedBy: Types.ObjectId;

  @Prop({ type: Object })
  meta: Record<string, unknown>;

  @Prop()
  ip: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ performedBy: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, resource: 1 });
AuditLogSchema.index({ createdAt: -1 });
