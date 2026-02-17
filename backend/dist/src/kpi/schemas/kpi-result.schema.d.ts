import { Document, Types } from 'mongoose';
export declare class KpiResult extends Document {
    userId: Types.ObjectId;
    kpiId: Types.ObjectId;
    periodStart: Date;
    periodEnd: Date;
    score: number;
    adminFeedback: string;
    bonusAmount: number;
    currency: string;
    isAutoCalculated: boolean;
    updatedBy: Types.ObjectId;
}
export declare const KpiResultSchema: import("mongoose").Schema<KpiResult, import("mongoose").Model<KpiResult, any, any, any, Document<unknown, any, KpiResult, any, {}> & KpiResult & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, KpiResult, Document<unknown, {}, import("mongoose").FlatRecord<KpiResult>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<KpiResult> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
