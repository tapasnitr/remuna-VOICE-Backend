import { Router } from 'express';
import { buildAgentManagement } from './container.js';
import { AgentController } from './presentation/AgentController.js';
import { registerAgentRoutes } from './presentation/routes.js';

export function registerAgentManagement(router: Router) {
    const {
        createAgentUseCase,
        getAgentConfigUseCase,
        updateAgentHeartbeatUseCase,
        listAgentsUseCase,
        getAgentDetailsUseCase,
        updateAgentUseCase,
        deleteAgentUseCase,
        apiKeyAuthMiddleware,
        authenticateAgentUseCase,
        getAgentUsersUseCase
    } = buildAgentManagement();

    const controller = new AgentController(
        createAgentUseCase,
        getAgentConfigUseCase,
        updateAgentHeartbeatUseCase,
        listAgentsUseCase,
        getAgentDetailsUseCase,
        updateAgentUseCase,
        deleteAgentUseCase,
        authenticateAgentUseCase,
        getAgentUsersUseCase
    );

    registerAgentRoutes(router, controller, apiKeyAuthMiddleware);

    router.get('/agents/me',
        (req, res, next) => apiKeyAuthMiddleware.handle(req, res, next),
        (req, res) => {
            res.json({
                message: 'You are authenticated!',
                agent: req.agent
            });
        }
    );
}