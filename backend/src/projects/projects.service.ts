import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './schemas/project.schema';
import { ProjectAssignment } from './schemas/project-assignment.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignMembersDto } from './dto/assign-members.dto';
import { ProjectRole } from '../common/enums';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ProjectAssignment.name) private assignmentModel: Model<ProjectAssignment>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Record<string, unknown>> {
    const project = await this.projectModel.create({
      ...dto,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
    });
    return project.toObject() as unknown as Record<string, unknown>;
  }

  async findAll(filters?: { status?: string }): Promise<Record<string, unknown>[]> {
    const q: Record<string, unknown> = {};
    if (filters?.status) q.status = filters.status;
    const projects = await this.projectModel.find(q).sort({ priority: -1, deadline: 1 }).lean();
    const assignments = await this.assignmentModel
      .find()
      .populate('userId', 'name email position seniority')
      .lean();
    const byProject = new Map<string, typeof assignments>();
    for (const a of assignments) {
      const pid = (a.projectId as { _id: Types.ObjectId })._id.toString();
      if (!byProject.has(pid)) byProject.set(pid, []);
      byProject.get(pid)!.push(a);
    }
    return projects.map((p) => ({
      ...p,
      assignments: byProject.get((p as { _id: Types.ObjectId })._id.toString()) || [],
    })) as Record<string, unknown>[];
  }

  async findOne(id: string): Promise<Record<string, unknown>> {
    const project = await this.projectModel.findById(id).lean();
    if (!project) throw new NotFoundException('Project not found');
    const assignments = await this.assignmentModel
      .find({ projectId: id })
      .populate('userId', 'name email position seniority')
      .lean();
    return { ...project, assignments } as Record<string, unknown>;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const payload: Record<string, unknown> = { ...dto };
    if (dto.deadline) payload.deadline = new Date(dto.deadline);
    const project = await this.projectModel
      .findByIdAndUpdate(id, { $set: payload }, { new: true })
      .lean();
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async remove(id: string) {
    const project = await this.projectModel.findByIdAndDelete(id);
    if (!project) throw new NotFoundException('Project not found');
    await this.assignmentModel.deleteMany({ projectId: id });
    return { message: 'Project deleted' };
  }

  async assignMembers(projectId: string, dto: AssignMembersDto): Promise<Record<string, unknown>> {
    const project = await this.projectModel.findById(projectId);
    if (!project) throw new NotFoundException('Project not found');
    await this.assignmentModel.deleteMany({ projectId });
    const toInsert = dto.assignments.map((a) => ({
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(a.userId),
      role: a.role,
    }));
    if (toInsert.length) await this.assignmentModel.insertMany(toInsert);
    return this.findOne(projectId);
  }
}
