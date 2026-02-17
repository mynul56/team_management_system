import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Position, Seniority } from '../../common/enums';
import { KpiMeasurementType } from '../../common/enums';

export class UpdateKpiDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  weight?: number;

  @IsOptional()
  @IsEnum(KpiMeasurementType)
  measurementType?: KpiMeasurementType;

  @IsOptional()
  @IsArray()
  @IsEnum(Position, { each: true })
  positions?: Position[];

  @IsOptional()
  @IsArray()
  @IsEnum(Seniority, { each: true })
  seniorities?: Seniority[];

  @IsOptional()
  @IsString()
  description?: string;
}
