import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Position, Seniority, UserRole } from '../../common/enums';

export class UpdateUserAdminDto {
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

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
