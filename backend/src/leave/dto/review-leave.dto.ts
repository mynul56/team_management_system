import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeaveStatus } from '../../common/enums';

export class ReviewLeaveDto {
  @IsEnum(LeaveStatus)
  status: LeaveStatus;

  @IsOptional()
  @IsString()
  reviewNote?: string;
}
