import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignMembersDto } from './dto/assign-members.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(status?: string): Promise<Record<string, unknown>[]>;
    findOne(id: string): Promise<Record<string, unknown>>;
    create(dto: CreateProjectDto): Promise<Record<string, unknown>>;
    update(id: string, dto: UpdateProjectDto): Promise<import("mongoose").FlattenMaps<import("./schemas/project.schema").Project> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    assignMembers(id: string, dto: AssignMembersDto): Promise<Record<string, unknown>>;
}
