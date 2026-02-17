import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { LeaveType } from '../../common/enums';

export class CreateLeaveDto {
  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
