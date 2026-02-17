import { Document } from 'mongoose';
import { Position, Seniority } from '../../common/enums';
import { KpiMeasurementType } from '../../common/enums';
export declare class Kpi extends Document {
    name: string;
    weight: number;
    measurementType: KpiMeasurementType;
    positions: Position[];
    seniorities: Seniority[];
    description: string;
}
export declare const KpiSchema: import("mongoose").Schema<Kpi, import("mongoose").Model<Kpi, any, any, any, Document<unknown, any, Kpi, any, {}> & Kpi & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Kpi, Document<unknown, {}, import("mongoose").FlatRecord<Kpi>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Kpi> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
