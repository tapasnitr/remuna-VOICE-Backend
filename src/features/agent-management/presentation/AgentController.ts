import { Request, Response, NextFunction } from 'express';
import { CreateAgentUseCase } from '../application/usecases/CreateAgentUseCase.js';
import { GetAgentConfigUseCase } from '../application/usecases/GetAgentConfigUseCase.js';
import { UpdateAgentHeartbeatUseCase } from '../application/usecases/UpdateAgentHeartbeatUseCase.js';
import { ListAgentsUseCase } from '../application/usecases/ListAgentsUseCase.js';
import { GetAgentDetailsUseCase } from '../application/usecases/GetAgentDetailsUseCase.js';
import { UpdateAgentUseCase } from '../application/usecases/UpdateAgentUseCase.js';
import { DeleteAgentUseCase } from '../application/usecases/DeleteAgentUseCase.js';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/responses/ApiResponse.js';

import { AuthenticateAgentUseCase } from '../application/usecases/AuthenticateAgentUseCase.js';
import { GetAgentUsersUseCase } from '../application/usecases/GetAgentUsersUseCase.js';

export class AgentController {
    constructor(
        private readonly createAgentUseCase: CreateAgentUseCase,
        private readonly getAgentConfigUseCase: GetAgentConfigUseCase,
        private readonly updateAgentHeartbeatUseCase: UpdateAgentHeartbeatUseCase,
        private readonly listAgentsUseCase: ListAgentsUseCase,
        private readonly getAgentDetailsUseCase: GetAgentDetailsUseCase,
        private readonly updateAgentUseCase: UpdateAgentUseCase,
        private readonly deleteAgentUseCase: DeleteAgentUseCase,
        private readonly authenticateAgentUseCase: AuthenticateAgentUseCase,
        private readonly getAgentUsersUseCase: GetAgentUsersUseCase
    ) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, branchId } = req.body;
            const orgId = req.user?.orgId;

            if (!orgId) {
                res.status(StatusCodes.UNAUTHORIZED).json(
                    new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Could not determine organization from token')
                );
                return;
            }

            if (!branchId) {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Branch ID is required')
                );
                return;
            }

            const result = await this.createAgentUseCase.execute({
                orgId,
                branchId,
                name
            });

            res.status(StatusCodes.CREATED).json(
                new ApiResponse(StatusCodes.CREATED, result, "Agent created successfully")
            );
        } catch (error) {
            next(error);
        }
    }

    async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { apiKey } = req.body;
            if (!apiKey) {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'API key is required')
                );
                return;
            }

            const agent = await this.authenticateAgentUseCase.execute(apiKey);

            if (!agent) {
                res.status(StatusCodes.UNAUTHORIZED).json(
                    new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Invalid API key')
                );
                return;
            }

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, {
                    agentId: agent.id,
                    agentName: agent.name
                }, 'API key is valid')
            );
        } catch (error: any) {
            next(error);
        }
    }

    async getConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const agent = req.agent;
            if (!agent) {
                res.status(StatusCodes.UNAUTHORIZED).json(
                    new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Agent not authenticated')
                );
                return;
            }

            const config = await this.getAgentConfigUseCase.execute(agent.id);

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, config, 'Config fetched successfully')
            );
        } catch (error: any) {
            next(error);
        }
    }

    async heartbeat(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const agent = req.agent;
            if (!agent) {
                res.status(StatusCodes.UNAUTHORIZED).json(
                    new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Agent not authenticated')
                );
                return;
            }

            const { devices } = req.body;

            await this.updateAgentHeartbeatUseCase.execute({
                agentId: agent.id,
                deviceStatuses: devices?.map((d: any) => ({
                    deviceId: d.serialNo, // Map serialNo to deviceId for now as devices are identified by serialNo in agent payload
                    status: d.status,
                    lastSync: d.lastSeen,
                    errorMessage: null
                })) || []
            });

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, null, 'Heartbeat received')
            );
        } catch (error: any) {
            next(error);
        }
    }

    async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const agents = await this.listAgentsUseCase.execute();

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, { agents }, 'Agents fetched successfully')
            );
        } catch (error: any) {
            next(error);
        }
    }

    async getDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Invalid agent ID')
                );
                return;
            }

            const agent = await this.getAgentDetailsUseCase.execute(id);

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, agent, 'Agent details fetched successfully')
            );
        } catch (error: any) {
            if (error.message === 'Agent not found') {
                res.status(StatusCodes.NOT_FOUND).json(
                    new ApiResponse(StatusCodes.NOT_FOUND, null, 'Agent not found')
                );
                return;
            }
            next(error);
        }
    }

    async updateAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!id || typeof id !== 'string') {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Invalid agent ID')
                );
                return;
            }

            const agent = await this.updateAgentUseCase.execute({ id, name });

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, agent, 'Agent updated successfully')
            );
        } catch (error: any) {
            if (error.message === 'Agent not found') {
                res.status(StatusCodes.NOT_FOUND).json(
                    new ApiResponse(StatusCodes.NOT_FOUND, null, 'Agent not found')
                );
                return;
            }
            next(error);
        }
    }

    async deleteAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Invalid agent ID')
                );
                return;
            }

            await this.deleteAgentUseCase.execute(id);

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, null, 'Agent deleted successfully')
            );
        } catch (error: any) {
            if (error.message === 'Agent not found') {
                res.status(StatusCodes.NOT_FOUND).json(
                    new ApiResponse(StatusCodes.NOT_FOUND, null, 'Agent not found')
                );
                return;
            }
            next(error);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const agent = req.agent;
            if (!agent) {
                res.status(StatusCodes.UNAUTHORIZED).json(
                    new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Agent not authenticated')
                );
                return;
            }

            const users = await this.getAgentUsersUseCase.execute(agent.id);

            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, { users }, 'Users fetched successfully')
            );
        } catch (error: any) {
            next(error);
        }
    }
}
