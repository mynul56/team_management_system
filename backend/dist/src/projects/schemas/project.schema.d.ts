import { Document } from 'mongoose';
import { ProjectType, ProjectStatus } from '../../common/enums';
export declare class Project extends Document {
    name: string;
    client: string;
    projectType: ProjectType;
    status: ProjectStatus;
    priority: number;
    deadline: Date;
    documentUrls: string[];
    figmaLinks: string[];
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project, any, {}> & Project & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Project> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
