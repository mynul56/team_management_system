import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateDailyUpdateDto {
  @IsMongoId()
  projectId: string;

  @IsString()
  completedToday: string;

  @IsString()
  inProgress: string;

  @IsOptional()
  @IsString()
  blockers?: string;
}
