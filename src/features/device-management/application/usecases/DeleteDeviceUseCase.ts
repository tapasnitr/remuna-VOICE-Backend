import { DeviceRepository } from '../../domain/repositories/DeviceRepository.js';

export class DeleteDeviceUseCase {
    constructor(
        private readonly deviceRepository: DeviceRepository
    ) { }

    async execute(deviceId: string): Promise<void> {
        const device = await this.deviceRepository.findById(deviceId);
        if (!device) {
            throw new Error('Device not found');
        }

        await this.deviceRepository.delete(deviceId);
    }
}
