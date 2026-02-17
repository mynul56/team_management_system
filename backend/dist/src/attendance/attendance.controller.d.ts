import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in-out.dto';
import { OverrideAttendanceDto } from './dto/override-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(userId: string, dto: CheckInDto): Promise<import("./schemas/attendance.schema").Attendance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    checkOut(userId: string, dto: CheckInDto): Promise<import("./schemas/attendance.schema").Attendance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyAttendance(userId: string, from: string, to: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/attendance.schema").Attendance> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getToday(userId: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/attendance.schema").Attendance> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    adminList(from: string, to: string, userId?: string, status?: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/attendance.schema").Attendance> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminOverride(adminId: string, attendanceId: string, dto: OverrideAttendanceDto): Promise<import("./schemas/attendance.schema").Attendance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
