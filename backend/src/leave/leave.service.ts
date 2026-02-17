import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Leave } from './schemas/leave.schema';
import { LeaveStatus } from '../common/enums';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ReviewLeaveDto } from './dto/review-leave.dto';

@Injectable()
export class LeaveService {
  constructor(@InjectModel(Leave.name) private leaveModel: Model<Leave>) {}

  async create(userId: string, dto: CreateLeaveDto) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end < start) throw new BadRequestException('endDate must be after startDate');
    const leave = await this.leaveModel.create({
      userId: new Types.ObjectId(userId),
      leaveType: dto.leaveType,
      startDate: start,
      endDate: end,
      reason: dto.reason,
      status: LeaveStatus.PENDING,
    });
    return leave.toObject();
  }

  async getMyLeaves(userId: string, from?: string, to?: string) {
    const q: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (from) q.startDate = { $gte: new Date(from) };
    if (to) q.endDate = { $lte: new Date(to) };
    return this.leaveModel.find(q).sort({ startDate: -1 }).lean();
  }

  async adminList(filters?: { status?: LeaveStatus; userId?: string }) {
    const q: Record<string, unknown> = {};
    if (filters?.status) q.status = filters.status;
    if (filters?.userId) q.userId = new Types.ObjectId(filters.userId);
    return this.leaveModel
      .find(q)
      .populate('userId', 'name email position seniority')
      .sort({ createdAt: -1 })
      .lean();
  }

  async review(adminId: string, leaveId: string, dto: ReviewLeaveDto) {
    const leave = await this.leaveModel.findByIdAndUpdate(
      leaveId,
      {
        $set: {
          status: dto.status,
          reviewedBy: new Types.ObjectId(adminId),
          reviewedAt: new Date(),
          reviewNote: dto.reviewNote,
        },
      },
      { new: true },
    )
      .populate('userId', 'name email')
      .lean();
    if (!leave) throw new NotFoundException('Leave request not found');
    return leave;
  }
}
