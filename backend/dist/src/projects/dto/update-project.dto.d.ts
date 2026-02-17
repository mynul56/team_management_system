import { ProjectType, ProjectStatus } from '../../common/enums';
export declare class UpdateProjectDto {
    name?: string;
    client?: string;
    projectType?: ProjectType;
    status?: ProjectStatus;
    priority?: number;
    deadline?: string;
    documentUrls?: string[];
    figmaLinks?: string[];
}
