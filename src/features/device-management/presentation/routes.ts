import { Router } from 'express';
import { DeviceController } from './DeviceController.js';

export function registerDeviceRoutes(
    router: Router,
    controller: DeviceController
) {
    router.post('/admin/devices', (req, res, next) => controller.register(req, res, next));
    router.get('/admin/agents/:agentId/devices', (req, res, next) => controller.listDevices(req, res, next));
    router.put('/admin/devices/:id', (req, res, next) => controller.updateDevice(req, res, next));
    router.delete('/admin/devices/:id', (req, res, next) => controller.deleteDevice(req, res, next));
}
