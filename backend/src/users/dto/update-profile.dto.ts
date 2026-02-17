import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Position, Seniority } from '../../common/enums';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @IsOptional()
  @IsEnum(Seniority)
  seniority?: Seniority;
}
