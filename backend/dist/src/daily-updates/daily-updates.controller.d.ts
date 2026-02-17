import { DailyUpdatesService } from './daily-updates.service';
import { CreateDailyUpdateDto } from './dto/create-daily-update.dto';
export declare class DailyUpdatesController {
    private readonly dailyUpdatesService;
    constructor(dailyUpdatesService: DailyUpdatesService);
    submit(userId: string, date: string, dto: CreateDailyUpdateDto): Promise<import("./schemas/daily-update.schema").DailyUpdate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyUpdates(userId: string, from: string, to: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/daily-update.schema").DailyUpdate> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminListByDate(date: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/daily-update.schema").DailyUpdate> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminBlockers(from: string, to: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/daily-update.schema").DailyUpdate> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    submissionStatus(date: string): Promise<{
        date: string;
        submittedUserIds: string[];
    }>;
}
