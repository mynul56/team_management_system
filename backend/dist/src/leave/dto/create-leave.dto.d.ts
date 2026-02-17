import { LeaveType } from '../../common/enums';
export declare class CreateLeaveDto {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason?: string;
}
