import { Document, Types } from 'mongoose';
import { AttendanceStatus } from '../../common/enums';
export declare class Attendance extends Document {
    userId: Types.ObjectId;
    date: Date;
    checkIn: Date;
    checkOut: Date;
    status: AttendanceStatus;
    adminOverride: boolean;
    adminOverrideReason: string;
    overriddenBy: Types.ObjectId;
}
export declare const AttendanceSchema: import("mongoose").Schema<Attendance, import("mongoose").Model<Attendance, any, any, any, Document<unknown, any, Attendance, any, {}> & Attendance & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Attendance, Document<unknown, {}, import("mongoose").FlatRecord<Attendance>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Attendance> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
