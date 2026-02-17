import { Model, Types } from 'mongoose';
import { Kpi } from './schemas/kpi.schema';
import { KpiResult } from './schemas/kpi-result.schema';
import { User } from '../users/schemas/user.schema';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { DailyUpdate } from '../daily-updates/schemas/daily-update.schema';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { UpsertKpiResultDto } from './dto/upsert-kpi-result.dto';
export declare class KpiService {
    private kpiModel;
    private kpiResultModel;
    private userModel;
    private attendanceModel;
    private dailyUpdateModel;
    constructor(kpiModel: Model<Kpi>, kpiResultModel: Model<KpiResult>, userModel: Model<User>, attendanceModel: Model<Attendance>, dailyUpdateModel: Model<DailyUpdate>);
    create(dto: CreateKpiDto): Promise<Kpi & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filters?: {
        position?: string;
        seniority?: string;
    }): Promise<(import("mongoose").FlattenMaps<Kpi> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").FlattenMaps<Kpi> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: UpdateKpiDto): Promise<import("mongoose").FlattenMaps<Kpi> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private appliesToUser;
    getMyKpis(userId: string, periodStart: string, periodEnd: string): Promise<{
        kpi: import("mongoose").FlattenMaps<Kpi> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        result: (import("mongoose").FlattenMaps<KpiResult> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
    }[]>;
    adminUpsertResult(adminId: string, userId: string, kpiId: string, dto: UpsertKpiResultDto): Promise<(KpiResult & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | (import("mongoose").FlattenMaps<KpiResult> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    computeAttendanceKpi(userId: string, periodStart: Date, periodEnd: Date): Promise<number>;
    computeDailyUpdateKpi(userId: string, periodStart: Date, periodEnd: Date): Promise<number>;
    recalculateAutoKpis(userId: string, periodStart: string, periodEnd: string): Promise<{
        kpiId: string;
        score: number;
    }[]>;
}
