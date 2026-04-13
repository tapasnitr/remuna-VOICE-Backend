import { DeviceRepository } from '../../domain/repositories/DeviceRepository.js';
import { Device } from '../../domain/entities/Device.js';

interface CreateDeviceDTO {
    agentId: string;
    ip: string;
    port: number;
    serialNo: string;
    model: string;
}

export class AddDeviceToAgentUseCase {
    constructor(
        private readonly deviceRepository: DeviceRepository
    ) { }

    async execute(dto: CreateDeviceDTO) {
        const existingDevice = await this.deviceRepository.findBySerialNo(dto.serialNo);
        if (existingDevice) {
            throw new Error('Device with this serial number already exists');
        }

        const device = Device.create({
            agentId: dto.agentId,
            ip: dto.ip,
            port: dto.port,
            serialNo: dto.serialNo,
            model: dto.model,
            status: 'offline',
            lastSeenAt: null
        });

        await this.deviceRepository.save(device);

        return {
            id: device.id,
            agentId: device.agentId,
            ip: device.ip,
            port: device.port,
            serialNo: device.serialNo,
            model: device.model,
            status: device.status
        };
    }
}
