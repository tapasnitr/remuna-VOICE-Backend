import { DeviceRepository } from '../../domain/repositories/DeviceRepository.js';

interface UpdateDeviceDTO {
    id: string;
    ip?: string;
    port?: number;
    model?: string;
}

export class UpdateDeviceUseCase {
    constructor(
        private readonly deviceRepository: DeviceRepository
    ) { }

    async execute(dto: UpdateDeviceDTO) {
        const device = await this.deviceRepository.findById(dto.id);
        if (!device) {
            throw new Error('Device not found');
        }

        if (dto.ip) device.updateIp(dto.ip);
        if (dto.port) device.updatePort(dto.port);
        if (dto.model) device.updateModel(dto.model);

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
