import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance } from './schemas/attendance.schema';
import { Leave } from '../leave/schemas/leave.schema';
import { AttendanceStatus, LeaveStatus } from '../common/enums';

const LATE_THRESHOLD_HOUR = 10;
const LATE_THRESHOLD_MINUTE = 0;
const HALF_DAY_MIN_HOURS = 4;

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    @InjectModel(Leave.name) private leaveModel: Model<Leave>,
  ) {}

  private toDateOnly(d: Date): Date {
    const x = new Date(d);
    x.setUTCHours(0, 0, 0, 0);
    return x;
  }

  private computeStatus(checkIn: Date, checkOut: Date | null, onLeave: boolean): AttendanceStatus {
    if (onLeave) return AttendanceStatus.LEAVE;
    if (!checkIn) return AttendanceStatus.ABSENT;
    const lateCutoff = new Date(checkIn);
    lateCutoff.setHours(LATE_THRESHOLD_HOUR, LATE_THRESHOLD_MINUTE, 0, 0);
    const isLate = checkIn > lateCutoff;
    if (!checkOut) return isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
    const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    if (hours < HALF_DAY_MIN_HOURS) return AttendanceStatus.HALF_DAY;
    return isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
  }

  private async hasApprovedLeave(userId: string, date: Date): Promise<boolean> {
    const start = this.toDateOnly(date);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    const leave = await this.leaveModel.findOne({
      userId: new Types.ObjectId(userId),
      status: LeaveStatus.APPROVED,
      $or: [
        { startDate: { $lt: end }, endDate: { $gte: start } },
      ],
    });
    return !!leave;
  }

  async checkIn(userId: string, timestamp?: string) {
    const now = new Date(timestamp || Date.now());
    const date = this.toDateOnly(now);
    const existing = await this.attendanceModel.findOne({
      userId: new Types.ObjectId(userId),
      date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
    });
    if (existing?.checkIn) throw new BadRequestException('Already checked in today');
    const onLeave = await this.hasApprovedLeave(userId, date);
    const status = onLeave
      ? AttendanceStatus.LEAVE
      : this.computeStatus(now, null, false);
    const att = await this.attendanceModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
      },
      {
        $set: {
          userId: new Types.ObjectId(userId),
          date,
          checkIn: now,
          status,
          adminOverride: false,
        },
      },
      { upsert: true, new: true },
    );
    return att.toObject();
  }

  async checkOut(userId: string, timestamp?: string) {
    const now = new Date(timestamp || Date.now());
    const date = this.toDateOnly(now);
    const att = await this.attendanceModel.findOne({
      userId: new Types.ObjectId(userId),
      date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) },
    });
    if (!att) throw new BadRequestException('No check-in found for today');
    if (att.checkOut) throw new BadRequestException('Already checked out');
    const onLeave = await this.hasApprovedLeave(userId, date);
    const status = att.adminOverride
      ? att.status
      : this.computeStatus(att.checkIn, now, onLeave);
    att.checkOut = now;
    att.status = status;
    await att.save();
    return att.toObject();
  }

  async getMyAttendance(userId: string, from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.attendanceModel
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: fromDate, $lte: toDate },
      })
      .sort({ date: -1 })
      .lean();
  }

  async getToday(userId: string) {
    const today = this.toDateOnly(new Date());
    const end = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    return this.attendanceModel
      .findOne({
        userId: new Types.ObjectId(userId),
        date: { $gte: today, $lt: end },
      })
      .lean();
  }

  async adminList(filters: { from: string; to: string; userId?: string; status?: AttendanceStatus }) {
    const q: Record<string, unknown> = {
      date: { $gte: new Date(filters.from), $lte: new Date(filters.to) },
    };
    if (filters.userId) q.userId = new Types.ObjectId(filters.userId);
    if (filters.status) q.status = filters.status;
    return this.attendanceModel
      .find(q)
      .populate('userId', 'name email position seniority')
      .sort({ date: -1 })
      .lean();
  }

  async adminOverride(adminId: string, attendanceId: string, status: AttendanceStatus, reason?: string) {
    const att = await this.attendanceModel.findByIdAndUpdate(
      attendanceId,
      {
        $set: {
          status,
          adminOverride: true,
          adminOverrideReason: reason,
          overriddenBy: new Types.ObjectId(adminId),
        },
      },
      { new: true },
    );
    if (!att) throw new NotFoundException('Attendance record not found');
    return att.toObject();
  }
}
