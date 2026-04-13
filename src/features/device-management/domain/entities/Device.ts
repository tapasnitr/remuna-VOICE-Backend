import { DeviceStatus } from '../enums/DeviceStatus.js';

export class Device {
    private constructor(
        public readonly id: string,
        public readonly agentId: string,
        public ip: string,
        public port: number,
        public model: string,
        public readonly serialNo: string,
        public status: DeviceStatus,
        public transferredTemplateCount: number,
        public lastSeenAt: Date | null,
        public readonly createdAt: Date
    ) { }

    static create(params: {
        agentId: string;
        ip: string;
        port: number;
        model: string;
        serialNo: string;
        status: string;
        lastSeenAt: Date | null;
    }): Device {
        const id = crypto.randomUUID();
        return new Device(
            id,
            params.agentId,
            params.ip,
            params.port,
            params.model,
            params.serialNo,
            params.status as DeviceStatus,
            0,
            params.lastSeenAt,
            new Date()
        );
    }

    static fromPersistence(data: {
        id: string;
        agentId: string;
        ip: string;
        port: number;
        model: string;
        serialNo: string;
        status: string;
        transferredTemplateCount: number;
        lastSeenAt: Date | null;
        createdAt: Date;
    }): Device {
        return new Device(
            data.id,
            data.agentId,
            data.ip,
            data.port,
            data.model,
            data.serialNo,
            data.status as DeviceStatus,
            data.transferredTemplateCount,
            data.lastSeenAt,
            data.createdAt
        );
    }

    markAsActive(): void {
        this.status = DeviceStatus.ACTIVE;
    }

    markAsOffline(): void {
        this.status = DeviceStatus.OFFLINE;
    }

    updateIp(ip: string): void {
        (this as any).ip = ip;
    }

    updatePort(port: number): void {
        (this as any).port = port;
    }

    updateModel(model: string): void {
        (this as any).model = model;
    }

    updateLastSeen(lastSeenAt: Date): void {
        (this as any).lastSeenAt = lastSeenAt;
    }
}
