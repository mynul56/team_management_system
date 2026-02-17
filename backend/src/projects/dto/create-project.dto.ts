import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectType, ProjectStatus } from '../../common/enums';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsEnum(ProjectType)
  projectType: ProjectType;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  figmaLinks?: string[];
}
