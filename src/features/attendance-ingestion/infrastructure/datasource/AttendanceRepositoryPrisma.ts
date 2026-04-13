import { prisma } from '../../../../shared/infrastructure/datasource/postgres/PgPool.js';
import { AttendanceLog } from '../../domain/entities/AttendanceLog.js';
import { AttendanceRepository, AttendanceLogWithUser } from '../../domain/repositories/AttendanceRepository.js';

export class AttendanceRepositoryPrisma implements AttendanceRepository {
    async saveBatch(logs: AttendanceLog[]): Promise<void> {
        if (logs.length === 0) return;

        // Process in chunks to avoid query parameter limits
        const CHUNK_SIZE = 500;
        for (let i = 0; i < logs.length; i += CHUNK_SIZE) {
            const chunk = logs.slice(i, i + CHUNK_SIZE);

            // 1. Check for existing logs in DB to avoid duplicates
            // We match on userId + timestamp + deviceId
            const conditions = chunk.map(log => ({
                userId: log.userId,
                timestamp: log.timestamp,
                deviceId: log.deviceId // Assuming deviceId is consistent (serial number)
            }));

            const existingLogs = await prisma.biometricAttendanceLog.findMany({
                where: {
                    OR: conditions
                },
                select: {
                    userId: true,
                    timestamp: true,
                    deviceId: true
                }
            });

            // Create a Set of existing keys for O(1) lookup
            const existingSet = new Set(
                existingLogs.map(l => `${l.userId}-${l.timestamp.getTime()}-${l.deviceId}`)
            );

            // 2. Filter out logs that already exist
            const newLogs = chunk.filter(log => {
                const key = `${log.userId}-${log.timestamp.getTime()}-${log.deviceId}`;
                return !existingSet.has(key);
            });

            if (newLogs.length === 0) continue;

            // 3. Insert unique logs
            await prisma.biometricAttendanceLog.createMany({
                data: newLogs.map(log => ({
                    agentId: log.agentId,
                    userId: log.userId,
                    timestamp: log.timestamp,
                    status: log.status,
                    deviceId: log.deviceId,
                    biometricDeviceId: log.biometricDeviceId,
                    createdAt: log.createdAt
                }))
            });

            console.log(`Saved ${newLogs.length} logs (skipped ${chunk.length - newLogs.length} duplicates)`);
        }
    }

    async getByGroupAndDate(groupId: number, date: Date): Promise<AttendanceLogWithUser[]> {
        // Build start-of-day and end-of-day boundaries in UTC
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Find all students that belong to this group
        const studentDetails = await prisma.studentDetails.findMany({
            where: {
                groupIds: {
                    has: groupId
                }
            },
            select: {
                forUser: true,
                User: {
                    select: {
                        userId: true,
                        name: true
                    }
                }
            }
        });

        if (studentDetails.length === 0) return [];

        // Build a lookup map: userId (string field) -> name
        const userMap = new Map<string, string>();
        for (const sd of studentDetails) {
            userMap.set(sd.User.userId, sd.User.name);
        }

        const userIds = Array.from(userMap.keys());

        // Fetch attendance logs for those userIds within the day
        const logs = await prisma.biometricAttendanceLog.findMany({
            where: {
                userId: { in: userIds },
                timestamp: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            orderBy: { timestamp: 'asc' }
        });

        return logs.map(log => ({
            id: log.id,
            userId: log.userId,
            name: userMap.get(log.userId) ?? log.userId,
            timestamp: log.timestamp,
            status: log.status,
            deviceId: log.deviceId,
            biometricDeviceId: log.biometricDeviceId
        }));
    }
}

