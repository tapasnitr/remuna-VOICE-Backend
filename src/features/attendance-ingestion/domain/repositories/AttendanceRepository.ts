import { AttendanceLog } from '../entities/AttendanceLog.js';

export interface AttendanceLogWithUser {
    id: string;
    userId: string;
    name: string;
    timestamp: Date;
    status: string;
    deviceId: string | null;
    biometricDeviceId: string | null;
}

export interface AttendanceRepository {
    saveBatch(logs: AttendanceLog[]): Promise<void>;
    getByGroupAndDate(groupId: number, date: Date): Promise<AttendanceLogWithUser[]>;
}

