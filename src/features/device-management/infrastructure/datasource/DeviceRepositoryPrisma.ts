import { prisma } from '../../../../shared/infrastructure/datasource/postgres/PgPool.js';
import { Device } from '../../domain/entities/Device.js';
import { DeviceRepository } from '../../domain/repositories/DeviceRepository.js';

export class DeviceRepositoryPrisma implements DeviceRepository {
    async save(device: Device): Promise<void> {
        await prisma.biometricDevice.upsert({
            where: { id: device.id },
            update: {
                ip: device.ip,
                port: device.port,
                model: device.model,
                status: device.status,
                lastSeenAt: device.lastSeenAt,
                transferredTemplateCount: device.transferredTemplateCount
            },
            create: {
                id: device.id,
                agentId: device.agentId,
                ip: device.ip,
                port: device.port,
                model: device.model,
                serialNo: device.serialNo,
                status: device.status,
                transferredTemplateCount: device.transferredTemplateCount,
                lastSeenAt: device.lastSeenAt,
                createdAt: device.createdAt
            }
        });
    }

    async findBySerialNo(serialNo: string): Promise<Device | null> {
        const row = await prisma.biometricDevice.findUnique({
            where: { serialNo }
        });

        if (!row) return null;

        return Device.fromPersistence({
            id: row.id,
            agentId: row.agentId,
            ip: row.ip,
            port: row.port,
            model: row.model,
            serialNo: row.serialNo,
            status: row.status,
            transferredTemplateCount: row.transferredTemplateCount,
            lastSeenAt: row.lastSeenAt,
            createdAt: row.createdAt
        });
    }

    async findByAgentId(agentId: string): Promise<Device[]> {
        const rows = await prisma.biometricDevice.findMany({
            where: { agentId }
        });

        return rows.map((row: any) => Device.fromPersistence({
            id: row.id,
            agentId: row.agentId,
            ip: row.ip,
            port: row.port,
            model: row.model,
            serialNo: row.serialNo,
            status: row.status,
            transferredTemplateCount: row.transferredTemplateCount,
            lastSeenAt: row.lastSeenAt,
            createdAt: row.createdAt
        }));
    }

    async findById(id: string): Promise<Device | null> {
        const row = await prisma.biometricDevice.findUnique({
            where: { id }
        });

        if (!row) return null;

        return Device.fromPersistence({
            id: row.id,
            agentId: row.agentId,
            ip: row.ip,
            port: row.port,
            model: row.model,
            serialNo: row.serialNo,
            status: row.status,
            transferredTemplateCount: row.transferredTemplateCount,
            lastSeenAt: row.lastSeenAt,
            createdAt: row.createdAt
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.biometricDevice.delete({
            where: { id }
        });
    }
}
