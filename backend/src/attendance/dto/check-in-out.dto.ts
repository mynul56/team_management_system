import { IsOptional, IsDateString } from 'class-validator';

export class CheckInDto {
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}

export class CheckOutDto {
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
