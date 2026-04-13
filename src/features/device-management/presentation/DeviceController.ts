import { Request, Response, NextFunction } from 'express';
import { RegisterDeviceUseCase } from '../application/usecases/RegisterDeviceUseCase.js';
import { UpdateDeviceUseCase } from '../application/usecases/UpdateDeviceUseCase.js';
import { DeleteDeviceUseCase } from '../application/usecases/DeleteDeviceUseCase.js';
import { DeviceRepository } from '../domain/repositories/DeviceRepository.js';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/responses/ApiResponse.js';

export class DeviceController {
    constructor(
        private readonly registerDeviceUseCase: RegisterDeviceUseCase,
        private readonly updateDeviceUseCase: UpdateDeviceUseCase,
        private readonly deleteDeviceUseCase: DeleteDeviceUseCase,
        private readonly deviceRepository: DeviceRepository
    ) { }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { agentId, ip, port, model, serialNo } = req.body;

            if (!agentId || !ip || !port || !model || !serialNo) {
                res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Missing required fields'));
                return;
            }

            const device = await this.registerDeviceUseCase.execute({
                agentId,
                ip,
                port,
                model,
                serialNo
            });

            res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, device, 'Device registered successfully'));
        } catch (error: any) {
            next(error);
        }
    }

    async listDevices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { agentId } = req.params;

            if (!agentId || typeof agentId !== 'string') {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Invalid agent ID')
                );
                return;
            }

            const devices = await this.deviceRepository.findByAgentId(agentId);

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, { devices }, 'Devices fetched successfully')
            );
        } catch (error: any) {
            next(error);
        }
    }

    async updateDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { ip, port, model } = req.body;

            if (!id || typeof id !== 'string') {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Invalid device ID')
                );
                return;
            }

            const device = await this.updateDeviceUseCase.execute({
                id,
                ip,
                port,
                model
            });

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, device, 'Device updated successfully')
            );
        } catch (error: any) {
            if (error.message === 'Device not found') {
                res.status(StatusCodes.NOT_FOUND).json(
                    new ApiResponse(StatusCodes.NOT_FOUND, null, 'Device not found')
                );
                return;
            }
            next(error);
        }
    }

    async deleteDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Invalid device ID')
                );
                return;
            }

            await this.deleteDeviceUseCase.execute(id);

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, null, 'Device deleted successfully')
            );
        } catch (error: any) {
            if (error.message === 'Device not found') {
                res.status(StatusCodes.NOT_FOUND).json(
                    new ApiResponse(StatusCodes.NOT_FOUND, null, 'Device not found')
                );
                return;
            }
            next(error);
        }
    }
}
