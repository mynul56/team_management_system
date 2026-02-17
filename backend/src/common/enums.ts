export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Position {
  UI_UX_DESIGNER = 'ui_ux_designer',
  WEB_DEVELOPER_FRONTEND = 'web_developer_frontend',
  WEB_DEVELOPER_BACKEND = 'web_developer_backend',
  WEB_DEVELOPER_FULLSTACK = 'web_developer_fullstack',
  FLUTTER_DEVELOPER = 'flutter_developer',
  AI_ML_DEVELOPER = 'ai_ml_developer',
}

export enum Seniority {
  TRAINEE = 'trainee',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
}

export enum LeaveType {
  CASUAL = 'casual',
  SICK = 'sick',
  EMERGENCY = 'emergency',
  WFH = 'wfh',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  LATE = 'late',
  HALF_DAY = 'half_day',
  LEAVE = 'leave',
  ABSENT = 'absent',
}

export enum ProjectType {
  WEB = 'web',
  APP = 'app',
  BOTH = 'both',
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
}

export enum ProjectRole {
  UI_UX = 'ui_ux',
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  AI = 'ai',
}

export enum KpiMeasurementType {
  AUTO = 'auto',
  MANUAL = 'manual',
}
