import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProjectRole } from '../../common/enums';

@Schema({ timestamps: true })
export class ProjectAssignment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ProjectRole, required: true })
  role: ProjectRole;
}

export const ProjectAssignmentSchema = SchemaFactory.createForClass(ProjectAssignment);
ProjectAssignmentSchema.index({ projectId: 1, userId: 1, role: 1 }, { unique: true });
ProjectAssignmentSchema.index({ userId: 1 });
ProjectAssignmentSchema.index({ projectId: 1 });
