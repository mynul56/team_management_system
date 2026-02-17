import { Model, Types } from 'mongoose';
import { Leave } from './schemas/leave.schema';
import { LeaveStatus } from '../common/enums';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ReviewLeaveDto } from './dto/review-leave.dto';
export declare class LeaveService {
    private leaveModel;
    constructor(leaveModel: Model<Leave>);
    create(userId: string, dto: CreateLeaveDto): Promise<Leave & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyLeaves(userId: string, from?: string, to?: string): Promise<(import("mongoose").FlattenMaps<Leave> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminList(filters?: {
        status?: LeaveStatus;
        userId?: string;
    }): Promise<(import("mongoose").FlattenMaps<Leave> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    review(adminId: string, leaveId: string, dto: ReviewLeaveDto): Promise<import("mongoose").FlattenMaps<Leave> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
