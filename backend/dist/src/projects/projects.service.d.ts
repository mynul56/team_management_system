import { Model, Types } from 'mongoose';
import { Project } from './schemas/project.schema';
import { ProjectAssignment } from './schemas/project-assignment.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignMembersDto } from './dto/assign-members.dto';
export declare class ProjectsService {
    private projectModel;
    private assignmentModel;
    constructor(projectModel: Model<Project>, assignmentModel: Model<ProjectAssignment>);
    create(dto: CreateProjectDto): Promise<Record<string, unknown>>;
    findAll(filters?: {
        status?: string;
    }): Promise<Record<string, unknown>[]>;
    findOne(id: string): Promise<Record<string, unknown>>;
    update(id: string, dto: UpdateProjectDto): Promise<import("mongoose").FlattenMaps<Project> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignMembers(projectId: string, dto: AssignMembersDto): Promise<Record<string, unknown>>;
}
