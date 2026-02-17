import { Document, Types } from 'mongoose';
export declare class AuditLog extends Document {
    action: string;
    resource: string;
    performedBy: Types.ObjectId;
    meta: Record<string, unknown>;
    ip: string;
}
export declare const AuditLogSchema: import("mongoose").Schema<AuditLog, import("mongoose").Model<AuditLog, any, any, any, Document<unknown, any, AuditLog, any, {}> & AuditLog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AuditLog, Document<unknown, {}, import("mongoose").FlatRecord<AuditLog>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AuditLog> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
