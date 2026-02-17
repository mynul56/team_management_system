"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./schemas/project.schema");
const project_assignment_schema_1 = require("./schemas/project-assignment.schema");
let ProjectsService = class ProjectsService {
    constructor(projectModel, assignmentModel) {
        this.projectModel = projectModel;
        this.assignmentModel = assignmentModel;
    }
    async create(dto) {
        const project = await this.projectModel.create({
            ...dto,
            deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        });
        return project.toObject();
    }
    async findAll(filters) {
        const q = {};
        if (filters?.status)
            q.status = filters.status;
        const projects = await this.projectModel.find(q).sort({ priority: -1, deadline: 1 }).lean();
        const assignments = await this.assignmentModel
            .find()
            .populate('userId', 'name email position seniority')
            .lean();
        const byProject = new Map();
        for (const a of assignments) {
            const pid = a.projectId._id.toString();
            if (!byProject.has(pid))
                byProject.set(pid, []);
            byProject.get(pid).push(a);
        }
        return projects.map((p) => ({
            ...p,
            assignments: byProject.get(p._id.toString()) || [],
        }));
    }
    async findOne(id) {
        const project = await this.projectModel.findById(id).lean();
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const assignments = await this.assignmentModel
            .find({ projectId: id })
            .populate('userId', 'name email position seniority')
            .lean();
        return { ...project, assignments };
    }
    async update(id, dto) {
        const payload = { ...dto };
        if (dto.deadline)
            payload.deadline = new Date(dto.deadline);
        const project = await this.projectModel
            .findByIdAndUpdate(id, { $set: payload }, { new: true })
            .lean();
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async remove(id) {
        const project = await this.projectModel.findByIdAndDelete(id);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        await this.assignmentModel.deleteMany({ projectId: id });
        return { message: 'Project deleted' };
    }
    async assignMembers(projectId, dto) {
        const project = await this.projectModel.findById(projectId);
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        await this.assignmentModel.deleteMany({ projectId });
        const toInsert = dto.assignments.map((a) => ({
            projectId: new mongoose_2.Types.ObjectId(projectId),
            userId: new mongoose_2.Types.ObjectId(a.userId),
            role: a.role,
        }));
        if (toInsert.length)
            await this.assignmentModel.insertMany(toInsert);
        return this.findOne(projectId);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_assignment_schema_1.ProjectAssignment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map