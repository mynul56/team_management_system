import { Document, Types } from 'mongoose';
import { ProjectRole } from '../../common/enums';
export declare class ProjectAssignment extends Document {
    projectId: Types.ObjectId;
    userId: Types.ObjectId;
    role: ProjectRole;
}
export declare const ProjectAssignmentSchema: import("mongoose").Schema<ProjectAssignment, import("mongoose").Model<ProjectAssignment, any, any, any, Document<unknown, any, ProjectAssignment, any, {}> & ProjectAssignment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProjectAssignment, Document<unknown, {}, import("mongoose").FlatRecord<ProjectAssignment>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ProjectAssignment> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
