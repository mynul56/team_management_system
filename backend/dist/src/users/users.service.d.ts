import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserRole } from '../common/enums';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { ProjectAssignment } from '../projects/schemas/project-assignment.schema';
export declare class UsersService {
    private userModel;
    private assignmentModel;
    constructor(userModel: Model<User>, assignmentModel: Model<ProjectAssignment>);
    findById(id: string): Promise<import("mongoose").FlattenMaps<User> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getProfile(userId: string): Promise<Record<string, unknown>>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAllAdmin(filters?: {
        role?: UserRole;
        position?: string;
        seniority?: string;
        pending?: boolean;
    }): Promise<(import("mongoose").FlattenMaps<User> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    approveUser(userId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateByAdmin(adminId: string, targetUserId: string, dto: UpdateUserAdminDto): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
