import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Kpi } from './schemas/kpi.schema';
import { KpiResult } from './schemas/kpi-result.schema';
import { User } from '../users/schemas/user.schema';
import { Attendance } from '../attendance/schemas/attendance.schema';

interface UserLike {
  position: string;
  seniority: string;
}
import { DailyUpdate } from '../daily-updates/schemas/daily-update.schema';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { UpdateKpiDto } from './dto/update-kpi.dto';
import { UpsertKpiResultDto } from './dto/upsert-kpi-result.dto';
import { KpiMeasurementType } from '../common/enums';
import { AttendanceStatus } from '../common/enums';

@Injectable()
export class KpiService {
  constructor(
    @InjectModel(Kpi.name) private kpiModel: Model<Kpi>,
    @InjectModel(KpiResult.name) private kpiResultModel: Model<KpiResult>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    @InjectModel(DailyUpdate.name) private dailyUpdateModel: Model<DailyUpdate>,
  ) { }

  async create(dto: CreateKpiDto) {
    const kpi = await this.kpiModel.create({
      ...dto,
      measurementType: dto.measurementType ?? KpiMeasurementType.MANUAL,
    });
    return kpi.toObject();
  }

  async findAll(filters?: { position?: string; seniority?: string }) {
    const q: Record<string, unknown> = {};
    if (filters?.position) q.positions = filters.position;
    if (filters?.seniority) q.seniorities = filters.seniority;
    return this.kpiModel.find(q).sort({ name: 1 }).lean();
  }

  async findOne(id: string) {
    const kpi = await this.kpiModel.findById(id).lean();
    if (!kpi) throw new NotFoundException('KPI not found');
    return kpi;
  }

  async update(id: string, dto: UpdateKpiDto) {
    const kpi = await this.kpiModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean();
    if (!kpi) throw new NotFoundException('KPI not found');
    return kpi;
  }

  async remove(id: string) {
    const kpi = await this.kpiModel.findByIdAndDelete(id);
    if (!kpi) throw new NotFoundException('KPI not found');
    await this.kpiResultModel.deleteMany({ kpiId: id });
    return { message: 'KPI deleted' };
  }

  private appliesToUser(kpi: { positions?: string[]; seniorities?: string[] }, user: UserLike) {
    if (kpi.positions?.length && !kpi.positions.includes(user.position)) return false;
    if (kpi.seniorities?.length && !kpi.seniorities.includes(user.seniority)) return false;
    return true;
  }

  async getMyKpis(userId: string, periodStart: string, periodEnd: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException('User not found');
    const kpis = await this.kpiModel.find({}).lean();
    const applicable = kpis.filter((k) => this.appliesToUser(k, user));
    const results = await this.kpiResultModel
      .find({
        userId: new Types.ObjectId(userId),
        periodStart: { $gte: new Date(periodStart) },
        periodEnd: { $lte: new Date(periodEnd) },
      })
      .lean();
    const byKpi = new Map<string, (typeof results)[0]>();
    for (const r of results) byKpi.set((r.kpiId as Types.ObjectId).toString(), r);
    return applicable.map((k) => ({
      kpi: k,
      result: byKpi.get((k as { _id: Types.ObjectId })._id.toString()) ?? null,
    }));
  }

  async adminUpsertResult(adminId: string, userId: string, kpiId: string, dto: UpsertKpiResultDto) {
    const existing = await this.kpiResultModel.findOne({
      userId: new Types.ObjectId(userId),
      kpiId: new Types.ObjectId(kpiId),
      periodStart: new Date(dto.periodStart),
      periodEnd: new Date(dto.periodEnd),
    });
    const payload = {
      userId: new Types.ObjectId(userId),
      kpiId: new Types.ObjectId(kpiId),
      periodStart: new Date(dto.periodStart),
      periodEnd: new Date(dto.periodEnd),
      score: dto.score,
      adminFeedback: dto.adminFeedback,
      bonusAmount: dto.bonusAmount,
      currency: dto.currency || 'USD',
      isAutoCalculated: false,
      updatedBy: new Types.ObjectId(adminId),
    };
    if (existing) {
      await this.kpiResultModel.updateOne({ _id: existing._id }, { $set: payload });
      return this.kpiResultModel.findById(existing._id).lean();
    }
    const created = await this.kpiResultModel.create(payload);
    return created.toObject();
  }

  async computeAttendanceKpi(userId: string, periodStart: Date, periodEnd: Date): Promise<number> {
    const records = await this.attendanceModel.find({
      userId: new Types.ObjectId(userId),
      date: { $gte: periodStart, $lte: periodEnd },
    }).lean();
    if (records.length === 0) return 0;
    const workingDays = records.length;
    const presentOrLate = records.filter(
      (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE,
    ).length;
    const halfDay = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;
    const score = (presentOrLate * 100 + halfDay * 50) / workingDays;
    return Math.min(100, Math.round(score * 100) / 100);
  }

  async computeDailyUpdateKpi(userId: string, periodStart: Date, periodEnd: Date): Promise<number> {
    const totalDays = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const submitted = await this.dailyUpdateModel.distinct('date', {
      userId: new Types.ObjectId(userId),
      date: { $gte: periodStart, $lte: periodEnd },
    });
    const rate = totalDays > 0 ? (submitted.length / totalDays) * 100 : 0;
    return Math.min(100, Math.round(rate * 100) / 100);
  }

  async recalculateAutoKpis(userId: string, periodStart: string, periodEnd: string) {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    const kpis = await this.kpiModel.find({ measurementType: KpiMeasurementType.AUTO }).lean();
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException('User not found');
    const results: Array<{ kpiId: string; score: number }> = [];
    for (const kpi of kpis) {
      if (!this.appliesToUser(kpi, user)) continue;
      const name = (kpi as { name: string }).name.toLowerCase();
      let score = 0;
      if (name.includes('attendance')) score = await this.computeAttendanceKpi(userId, start, end);
      else if (name.includes('daily') || name.includes('update')) score = await this.computeDailyUpdateKpi(userId, start, end);
      if (score > 0) {
        await this.kpiResultModel.findOneAndUpdate(
          { userId: new Types.ObjectId(userId), kpiId: kpi._id, periodStart: start, periodEnd: end },
          {
            $set: {
              userId: new Types.ObjectId(userId),
              kpiId: kpi._id,
              periodStart: start,
              periodEnd: end,
              score,
              isAutoCalculated: true,
            },
          },
          { upsert: true },
        );
        results.push({ kpiId: (kpi as { _id: Types.ObjectId })._id.toString(), score });
      }
    }
    return results;
  }
}
