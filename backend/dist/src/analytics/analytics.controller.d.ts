import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    dashboard(from: string, to: string): Promise<{
        attendanceOverview: {
            byStatus: Record<string, number>;
            byDate: {
                [k: string]: Record<string, number>;
            };
        };
        projectHealth: {
            _id: import("mongoose").Types.ObjectId;
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
    roleWiseWorkload(): Promise<any[]>;
}
