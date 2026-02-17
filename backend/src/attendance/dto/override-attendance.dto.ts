import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../../common/enums';

export class OverrideAttendanceDto {
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
