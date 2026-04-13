import { AttendanceLog } from '../../domain/entities/AttendanceLog.js';
import { AttendanceRepository } from '../../domain/repositories/AttendanceRepository.js';
import { FileLogService } from '../../../../shared/services/FileLogService.js';
import { DeviceRepository } from '../../../device-management/domain/repositories/DeviceRepository.js';

export class CommitAttendanceUseCase {
    constructor(
        private readonly attendanceRepository: AttendanceRepository,
        private readonly fileLogService: FileLogService,
        private readonly deviceRepository: DeviceRepository
    ) { }

    async getPendingCount(agentId: string): Promise<number> {
        return this.fileLogService.getPendingCount(agentId);
    }

    async execute(agentId: string): Promise<number> {
        const stagedLogs = await this.fileLogService.getPendingLogs(agentId);

        if (stagedLogs.length === 0) {
            return 0;
        }

        // Deduplicate: one record per student per calendar day (keep earliest tap)
        // Sort ascending so the first entry we see is always the earliest
        stagedLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const uniqueLogsMap = new Map<string, typeof stagedLogs[0]>();

        for (const log of stagedLogs) {
            const date = new Date(log.timestamp);
            // Key = userId + calendar date (YYYY-MM-DD) — one entry per student per day
            const dateStr = date.toISOString().slice(0, 10);
            const key = `${log.userId}-${dateStr}`;

            if (!uniqueLogsMap.has(key)) {
                uniqueLogsMap.set(key, log);
            }
        }

        const uniqueLogs = Array.from(uniqueLogsMap.values());

        // Fetch all devices for this agent to map SerialNo -> DeviceID (UUID)
        const devices = await this.deviceRepository.findByAgentId(agentId);
        const deviceMap = new Map<string, string>(); // SerialNo -> UUID
        devices.forEach(d => deviceMap.set(d.serialNo, d.id));

        const domainLogs = uniqueLogs.map(log => {
            const biometricDeviceId = log.deviceId ? deviceMap.get(log.deviceId) || null : null;

            return AttendanceLog.create({
                agentId: agentId,
                userId: log.userId,
                timestamp: new Date(log.timestamp),
                status: log.status,
                deviceId: log.deviceId || null,
                biometricDeviceId: biometricDeviceId
            });
        });

        // Bulk insert to DB
        await this.attendanceRepository.saveBatch(domainLogs);

        // Clear staging file after successful commit
        await this.fileLogService.clearLogs(agentId);

        return domainLogs.length;
    }
}
