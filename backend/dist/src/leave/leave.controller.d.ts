import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ReviewLeaveDto } from './dto/review-leave.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    create(userId: string, dto: CreateLeaveDto): Promise<import("./schemas/leave.schema").Leave & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyLeaves(userId: string, from?: string, to?: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/leave.schema").Leave> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminList(status?: string, userId?: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/leave.schema").Leave> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    review(adminId: string, leaveId: string, dto: ReviewLeaveDto): Promise<import("mongoose").FlattenMaps<import("./schemas/leave.schema").Leave> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
