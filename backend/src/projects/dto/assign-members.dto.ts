import { IsArray, IsEnum, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectRole } from '../../common/enums';

export class RoleAssignmentDto {
  @IsMongoId()
  userId: string;

  @IsEnum(ProjectRole)
  role: ProjectRole;
}

export class AssignMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleAssignmentDto)
  assignments: RoleAssignmentDto[];
}
