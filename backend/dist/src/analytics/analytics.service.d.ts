import { Model, Types } from 'mongoose';
import { AuditLog } from '../common/schemas/audit-log.schema';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { Leave } from '../leave/schemas/leave.schema';
import { DailyUpdate } from '../daily-updates/schemas/daily-update.schema';
import { Project } from '../projects/schemas/project.schema';
import { ProjectAssignment } from '../projects/schemas/project-assignment.schema';
import { KpiResult } from '../kpi/schemas/kpi-result.schema';
export declare class AnalyticsService {
    private auditLogModel;
    private attendanceModel;
    private leaveModel;
    private dailyUpdateModel;
    private projectModel;
    private assignmentModel;
    private kpiResultModel;
    constructor(auditLogModel: Model<AuditLog>, attendanceModel: Model<Attendance>, leaveModel: Model<Leave>, dailyUpdateModel: Model<DailyUpdate>, projectModel: Model<Project>, assignmentModel: Model<ProjectAssignment>, kpiResultModel: Model<KpiResult>);
    logAction(performedBy: string, action: string, resource: string, meta?: Record<string, unknown>, ip?: string): Promise<void>;
    dashboard(from: string, to: string): Promise<{
        attendanceOverview: {
            byStatus: Record<string, number>;
            byDate: {
                [k: string]: Record<string, number>;
            };
        };
        projectHealth: {
            _id: Types.ObjectId;
            name: string;
            status: string;
            deadline: Date | undefined;
            memberCount: any;
        }[];
        blockersCount: number;
        kpiSummary: {
            userId: string;
            averageScore: number;
            resultCount: number;
        }[];
        dateRange: {
            from: string;
            to: string;
        };
    }>;
    private attendanceOverview;
    private projectHealth;
    private kpiSummary;
    roleWiseWorkload(): Promise<any[]>;
}
