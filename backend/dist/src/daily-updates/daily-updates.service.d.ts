import { Model, Types } from 'mongoose';
import { DailyUpdate } from './schemas/daily-update.schema';
import { CreateDailyUpdateDto } from './dto/create-daily-update.dto';
export declare class DailyUpdatesService {
    private dailyUpdateModel;
    constructor(dailyUpdateModel: Model<DailyUpdate>);
    submit(userId: string, date: string, dto: CreateDailyUpdateDto): Promise<DailyUpdate & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyUpdates(userId: string, from: string, to: string): Promise<(import("mongoose").FlattenMaps<DailyUpdate> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminListByDate(date: string): Promise<(import("mongoose").FlattenMaps<DailyUpdate> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminListBlockers(from: string, to: string): Promise<(import("mongoose").FlattenMaps<DailyUpdate> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adminSubmissionStatus(date: string): Promise<{
        date: string;
        submittedUserIds: string[];
    }>;
}
