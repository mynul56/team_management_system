import { Document, Types } from 'mongoose';
export declare class DailyUpdate extends Document {
    userId: Types.ObjectId;
    date: Date;
    projectId: Types.ObjectId;
    completedToday: string;
    inProgress: string;
    blockers: string;
}
export declare const DailyUpdateSchema: import("mongoose").Schema<DailyUpdate, import("mongoose").Model<DailyUpdate, any, any, any, Document<unknown, any, DailyUpdate, any, {}> & DailyUpdate & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DailyUpdate, Document<unknown, {}, import("mongoose").FlatRecord<DailyUpdate>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DailyUpdate> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
