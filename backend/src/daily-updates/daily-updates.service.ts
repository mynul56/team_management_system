import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DailyUpdate } from './schemas/daily-update.schema';
import { CreateDailyUpdateDto } from './dto/create-daily-update.dto';

@Injectable()
export class DailyUpdatesService {
  constructor(@InjectModel(DailyUpdate.name) private dailyUpdateModel: Model<DailyUpdate>) {}

  async submit(userId: string, date: string, dto: CreateDailyUpdateDto) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    const existing = await this.dailyUpdateModel.findOne({
      userId: new Types.ObjectId(userId),
      date: d,
      projectId: new Types.ObjectId(dto.projectId),
    });
    if (existing) {
      existing.completedToday = dto.completedToday;
      existing.inProgress = dto.inProgress;
      existing.blockers = dto.blockers ?? '';
      await existing.save();
      return existing.toObject();
    }
    const update = await this.dailyUpdateModel.create({
      userId: new Types.ObjectId(userId),
      date: d,
      projectId: new Types.ObjectId(dto.projectId),
      completedToday: dto.completedToday,
      inProgress: dto.inProgress,
      blockers: dto.blockers ?? '',
    });
    return update.toObject();
  }

  async getMyUpdates(userId: string, from: string, to: string) {
    return this.dailyUpdateModel
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: new Date(from), $lte: new Date(to) },
      })
      .populate('projectId', 'name client')
      .sort({ date: -1 })
      .lean();
  }

  async adminListByDate(date: string) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    const end = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    const updates = await this.dailyUpdateModel
      .find({ date: { $gte: d, $lt: end } })
      .populate('userId', 'name email position seniority')
      .populate('projectId', 'name client')
      .sort({ createdAt: -1 })
      .lean();
    return updates;
  }

  async adminListBlockers(from: string, to: string) {
    const updates = await this.dailyUpdateModel
      .find({
        date: { $gte: new Date(from), $lte: new Date(to) },
        blockers: { $exists: true, $ne: '', $regex: /\S/ },
      })
      .populate('userId', 'name email')
      .populate('projectId', 'name')
      .sort({ date: -1 })
      .lean();
    return updates;
  }

  async adminSubmissionStatus(date: string) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    const end = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    const submittedUserIds = await this.dailyUpdateModel
      .distinct('userId', { date: { $gte: d, $lt: end } });
    return { date, submittedUserIds: submittedUserIds.map((id) => id.toString()) };
  }
}
