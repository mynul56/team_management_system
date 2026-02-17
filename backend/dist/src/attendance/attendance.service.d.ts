import { Model, Types } from 'mongoose';
import { Attendance } from './schemas/attendance.schema';
import { Leave } from '../leave/schemas/leave.schema';
import { AttendanceStatus } from '../common/enums';
export declare class AttendanceService {
    private attendanceModel;
    private leaveModel;
    constructor(attendanceModel: Model<Attendance>, leaveModel: Model<Leave>);
    private toDateOnly;
    private computeStatus;
    private hasApprovedLeave;
    checkIn(userId: string, timestamp?: string): Promise<Attendance & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    checkOut(userId: string, timestamp?: string): Promise<Attendance & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyAttendance(userId: string, from: string, to: string): Promise<(import("mongoose").FlattenMaps<Attendance> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getToday(userId: string): Promise<(import("mongoose").FlattenMaps<Attendance> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    adminList(filters: {
        from: string;
        to: string;
        userId?: string;
        status?: AttendanceStatus;
    }): Promise<(import("mongoose").FlattenMaps<Attendance> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminOverride(adminId: string, attendanceId: string, status: AttendanceStatus, reason?: string): Promise<Attendance & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
