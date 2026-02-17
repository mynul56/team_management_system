import { ProjectRole } from '../../common/enums';
export declare class RoleAssignmentDto {
    userId: string;
    role: ProjectRole;
}
export declare class AssignMembersDto {
    assignments: RoleAssignmentDto[];
}
