import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Position, Seniority } from '../../common/enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(Position)
  position: Position;

  @IsEnum(Seniority)
  seniority: Seniority;
}
