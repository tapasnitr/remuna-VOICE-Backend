import { Device } from '../../domain/entities/Device.js';
import { DeviceRepository } from '../../domain/repositories/DeviceRepository.js';
import { randomUUID } from 'crypto';

export class RegisterDeviceUseCase {
    constructor(private readonly deviceRepository: DeviceRepository) { }

    async execute(params: {
        agentId: string;
        ip: string; // validated by controller
        port: number;
        model: string;
        serialNo: string;
    }): Promise<Device> {
        const existingDevice = await this.deviceRepository.findBySerialNo(params.serialNo);
        if (existingDevice) {
            throw new Error(`Device with serial number ${params.serialNo} already exists`);
        }

        const device = Device.create({
            agentId: params.agentId,
            ip: params.ip,
            port: params.port,
            model: params.model,
            serialNo: params.serialNo,
            status: 'offline',
            lastSeenAt: null
        });

        await this.deviceRepository.save(device);

        return device;
    }
}
