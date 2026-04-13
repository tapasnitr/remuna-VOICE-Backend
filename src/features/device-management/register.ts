import { Router } from 'express';
import { buildDeviceManagement } from './container.js';
import { DeviceController } from './presentation/DeviceController.js';
import { registerDeviceRoutes } from './presentation/routes.js';

export function registerDeviceManagement(router: Router) {
    const { registerDeviceUseCase, updateDeviceUseCase, deleteDeviceUseCase, deviceRepository } = buildDeviceManagement();
    const controller = new DeviceController(registerDeviceUseCase, updateDeviceUseCase, deleteDeviceUseCase, deviceRepository);

    registerDeviceRoutes(router, controller);
}
