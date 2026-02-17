import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog } from '../common/schemas/audit-log.schema';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { Leave } from '../leave/schemas/leave.schema';
import { DailyUpdate } from '../daily-updates/schemas/daily-update.schema';
import { Project } from '../projects/schemas/project.schema';
import { ProjectAssignment } from '../projects/schemas/project-assignment.schema';
import { KpiResult } from '../kpi/schemas/kpi-result.schema';
import { AttendanceStatus } from '../common/enums';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    @InjectModel(Leave.name) private leaveModel: Model<Leave>,
    @InjectModel(DailyUpdate.name) private dailyUpdateModel: Model<DailyUpdate>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ProjectAssignment.name) private assignmentModel: Model<ProjectAssignment>,
    @InjectModel(KpiResult.name) private kpiResultModel: Model<KpiResult>,
  ) {}

  async logAction(performedBy: string, action: string, resource: string, meta?: Record<string, unknown>, ip?: string) {
    await this.auditLogModel.create({
      performedBy: new Types.ObjectId(performedBy),
      action,
      resource,
      meta,
      ip,
    });
  }

  async dashboard(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const [attendanceOverview, projectHealth, blockersCount, kpiSummary] = await Promise.all([
      this.attendanceOverview(fromDate, toDate),
      this.projectHealth(),
      this.dailyUpdateModel.countDocuments({
        date: { $gte: fromDate, $lte: toDate },
        blockers: { $exists: true, $ne: '', $regex: /\S/ },
      }),
      this.kpiSummary(fromDate, toDate),
    ]);

    return {
      attendanceOverview,
      projectHealth,
      blockersCount,
      kpiSummary,
      dateRange: { from, to },
    };
  }

  private async attendanceOverview(from: Date, to: Date) {
    const records = await this.attendanceModel
      .find({ date: { $gte: from, $lte: to } })
      .lean();
    const byStatus: Record<string, number> = {};
    for (const r of records) {
      const s = r.status || 'absent';
      byStatus[s] = (byStatus[s] || 0) + 1;
    }
    const byDate = new Map<string, Record<string, number>>();
    for (const r of records) {
      const d = (r.date as Date).toISOString().split('T')[0];
      if (!byDate.has(d)) byDate.set(d, { present: 0, late: 0, half_day: 0, leave: 0, absent: 0 });
      const map = byDate.get(d)!;
      const key = r.status === AttendanceStatus.PRESENT ? 'present' : r.status === AttendanceStatus.LATE ? 'late' : r.status === AttendanceStatus.HALF_DAY ? 'half_day' : r.status === AttendanceStatus.LEAVE ? 'leave' : 'absent';
      map[key] = (map[key] || 0) + 1;
    }
    return { byStatus, byDate: Object.fromEntries(byDate) };
  }

  private async projectHealth() {
    const projects = await this.projectModel.find({}).lean();
    const assignments = await this.assignmentModel.aggregate([
      { $group: { _id: '$projectId', count: { $sum: 1 } } },
    ]);
    const byProject = new Map(assignments.map((a) => [a._id.toString(), a.count]));
    return projects.map((p) => ({
      _id: (p as { _id: Types.ObjectId })._id,
      name: (p as { name: string }).name,
      status: (p as { status: string }).status,
      deadline: (p as { deadline?: Date }).deadline,
      memberCount: byProject.get((p as { _id: Types.ObjectId })._id.toString()) || 0,
    }));
  }

  private async kpiSummary(from: Date, to: Date) {
    const results = await this.kpiResultModel
      .find({
        periodStart: { $gte: from },
        periodEnd: { $lte: to },
      })
      .populate('userId', 'name position seniority')
      .lean();
    const byUser = new Map<string, { total: number; count: number }>();
    for (const r of results) {
      const uid = (r.userId as { _id: Types.ObjectId })._id.toString();
      if (!byUser.has(uid)) byUser.set(uid, { total: 0, count: 0 });
      const u = byUser.get(uid)!;
      u.total += r.score;
      u.count += 1;
    }
    return Array.from(byUser.entries()).map(([userId, { total, count }]) => ({
      userId,
      averageScore: count > 0 ? Math.round((total / count) * 100) / 100 : 0,
      resultCount: count,
    }));
  }

  async roleWiseWorkload() {
    const assignments = await this.assignmentModel
      .aggregate([
        { $group: { _id: { userId: '$userId', role: '$role' }, count: { $sum: 1 } } },
        { $group: { _id: '$_id.role', totalAssignments: { $sum: '$count' }, userCount: { $sum: 1 } } },
      ]);
    return assignments;
  }
}
