import { Document, Types } from 'mongoose';
import { LeaveType, LeaveStatus } from '../../common/enums';
export declare class Leave extends Document {
    userId: Types.ObjectId;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: LeaveStatus;
    reviewedBy: Types.ObjectId;
    reviewedAt: Date;
    reviewNote: string;
}
export declare const LeaveSchema: import("mongoose").Schema<Leave, import("mongoose").Model<Leave, any, any, any, Document<unknown, any, Leave, any, {}> & Leave & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Leave, Document<unknown, {}, import("mongoose").FlatRecord<Leave>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Leave> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
