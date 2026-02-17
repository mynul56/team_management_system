import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProjectType, ProjectStatus } from '../../common/enums';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  client: string;

  @Prop({ type: String, enum: ProjectType })
  projectType: ProjectType;

  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Prop()
  priority: number;

  @Prop()
  deadline: Date;

  @Prop({ type: [String], default: [] })
  documentUrls: string[];

  @Prop({ type: [String], default: [] })
  figmaLinks: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ deadline: 1 });
