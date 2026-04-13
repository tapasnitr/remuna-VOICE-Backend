import { Router } from 'express';
import { AgentController } from './AgentController.js';
import { ApiKeyAuthMiddleware } from './middleware/ApiKeyAuthMiddleware.js';
import { JwtAuthMiddleware } from '../../../presentation/middleware/JwtAuthMiddleware.js';

export function registerAgentRoutes(
    router: Router,
    controller: AgentController,
    apiKeyAuthMiddleware: ApiKeyAuthMiddleware
) {
    const jwtAuth = new JwtAuthMiddleware();
    router.get('/admin/agents', (req, res, next) => controller.listAll(req, res, next));
    router.get('/admin/agents/:id', (req, res, next) => controller.getDetails(req, res, next));
    router.post('/admin/agents', (req, res, next) => jwtAuth.handle(req, res, next), controller.create.bind(controller));
    router.put('/admin/agents/:id', (req, res, next) => controller.updateAgent(req, res, next));
    router.delete('/admin/agents/:id', (req, res, next) => controller.deleteAgent(req, res, next));
    router.post('/agent/verify', (req, res, next) => controller.verify(req, res, next));

    router.get(
        '/agent/config',
        (req, res, next) => apiKeyAuthMiddleware.handle(req, res, next),
        (req, res, next) => controller.getConfig(req, res, next)
    );

    router.post(
        '/agent/heartbeat',
        (req, res, next) => apiKeyAuthMiddleware.handle(req, res, next),
        (req, res, next) => controller.heartbeat(req, res, next)
    );

    router.get(
        '/agent/users',
        (req, res, next) => apiKeyAuthMiddleware.handle(req, res, next),
        (req, res, next) => controller.getUsers(req, res, next)
    );
}
