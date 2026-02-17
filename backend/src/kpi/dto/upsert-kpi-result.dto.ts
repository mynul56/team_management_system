import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpsertKpiResultDto {
  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsOptional()
  @IsString()
  adminFeedback?: string;

  @IsOptional()
  @IsNumber()
  bonusAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
