import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserRole } from '../common/enums';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { ProjectAssignment } from '../projects/schemas/project-assignment.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(ProjectAssignment.name) private assignmentModel: Model<ProjectAssignment>,
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getProfile(userId: string): Promise<Record<string, unknown>> {
    const user = await this.userModel.findById(userId).select('-passwordHash').lean();
    if (!user) throw new NotFoundException('User not found');
    const assignments = await this.assignmentModel
      .find({ userId: user._id })
      .populate('projectId', 'name client status deadline')
      .lean();
    return { ...user, assignedProjects: assignments } as Record<string, unknown>;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: dto },
      { new: true },
    ).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAllAdmin(filters?: { role?: UserRole; position?: string; seniority?: string; pending?: boolean }) {
    const q: Record<string, unknown> = {};
    if (filters?.role) q.role = filters.role;
    if (filters?.position) q.position = filters.position;
    if (filters?.seniority) q.seniority = filters.seniority;
    if (filters?.pending === true) q.isActive = false;
    return this.userModel.find(q).select('-passwordHash').sort({ name: 1 }).lean();
  }

  async approveUser(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { isActive: true } },
      { new: true },
    ).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateByAdmin(adminId: string, targetUserId: string, dto: UpdateUserAdminDto) {
    const user = await this.userModel.findByIdAndUpdate(
      targetUserId,
      { $set: dto },
      { new: true },
    ).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
