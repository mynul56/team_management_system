"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpiMeasurementType = exports.ProjectRole = exports.ProjectStatus = exports.ProjectType = exports.AttendanceStatus = exports.LeaveStatus = exports.LeaveType = exports.Seniority = exports.Position = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var Position;
(function (Position) {
    Position["UI_UX_DESIGNER"] = "ui_ux_designer";
    Position["WEB_DEVELOPER_FRONTEND"] = "web_developer_frontend";
    Position["WEB_DEVELOPER_BACKEND"] = "web_developer_backend";
    Position["WEB_DEVELOPER_FULLSTACK"] = "web_developer_fullstack";
    Position["FLUTTER_DEVELOPER"] = "flutter_developer";
    Position["AI_ML_DEVELOPER"] = "ai_ml_developer";
})(Position || (exports.Position = Position = {}));
var Seniority;
(function (Seniority) {
    Seniority["TRAINEE"] = "trainee";
    Seniority["JUNIOR"] = "junior";
    Seniority["MID"] = "mid";
    Seniority["SENIOR"] = "senior";
    Seniority["LEAD"] = "lead";
})(Seniority || (exports.Seniority = Seniority = {}));
var LeaveType;
(function (LeaveType) {
    LeaveType["CASUAL"] = "casual";
    LeaveType["SICK"] = "sick";
    LeaveType["EMERGENCY"] = "emergency";
    LeaveType["WFH"] = "wfh";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["PENDING"] = "pending";
    LeaveStatus["APPROVED"] = "approved";
    LeaveStatus["REJECTED"] = "rejected";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["LATE"] = "late";
    AttendanceStatus["HALF_DAY"] = "half_day";
    AttendanceStatus["LEAVE"] = "leave";
    AttendanceStatus["ABSENT"] = "absent";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var ProjectType;
(function (ProjectType) {
    ProjectType["WEB"] = "web";
    ProjectType["APP"] = "app";
    ProjectType["BOTH"] = "both";
})(ProjectType || (exports.ProjectType = ProjectType = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "planning";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["ON_HOLD"] = "on_hold";
    ProjectStatus["COMPLETED"] = "completed";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["UI_UX"] = "ui_ux";
    ProjectRole["FRONTEND"] = "frontend";
    ProjectRole["BACKEND"] = "backend";
    ProjectRole["AI"] = "ai";
})(ProjectRole || (exports.ProjectRole = ProjectRole = {}));
var KpiMeasurementType;
(function (KpiMeasurementType) {
    KpiMeasurementType["AUTO"] = "auto";
    KpiMeasurementType["MANUAL"] = "manual";
})(KpiMeasurementType || (exports.KpiMeasurementType = KpiMeasurementType = {}));
//# sourceMappingURL=enums.js.map