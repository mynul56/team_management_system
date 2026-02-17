import { Position, Seniority, UserRole } from '../../common/enums';
export declare class UpdateUserAdminDto {
    name?: string;
    position?: Position;
    seniority?: Seniority;
    role?: UserRole;
    isActive?: boolean;
}
