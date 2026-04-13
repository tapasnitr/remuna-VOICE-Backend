import { DeviceRepositoryPrisma } from './infrastructure/datasource/DeviceRepositoryPrisma.js';
import { RegisterDeviceUseCase } from './application/usecases/RegisterDeviceUseCase.js';
import { UpdateDeviceUseCase } from './application/usecases/UpdateDeviceUseCase.js';
import { DeleteDeviceUseCase } from './application/usecases/DeleteDeviceUseCase.js';

export function buildDeviceManagement() {
    const deviceRepository = new DeviceRepositoryPrisma();
    const registerDeviceUseCase = new RegisterDeviceUseCase(deviceRepository);
    const updateDeviceUseCase = new UpdateDeviceUseCase(deviceRepository);
    const deleteDeviceUseCase = new DeleteDeviceUseCase(deviceRepository);

    return {
        registerDeviceUseCase,
        updateDeviceUseCase,
        deleteDeviceUseCase,
        deviceRepository
    };
}
