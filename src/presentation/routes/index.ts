import { Router } from 'express';
import { registerAgentManagement } from '../../features/agent-management/register.js';
import { registerDeviceManagement } from '../../features/device-management/register.js';
import { registerAttendanceIngestion } from '../../features/attendance-ingestion/register.js';
import { registerOrganizationManagement } from '../../features/org-management/register.js';
import { JwtAuthMiddleware } from '../middleware/JwtAuthMiddleware.js';

export function registerRoutes(): Router {
    const router = Router();
    const jwtAuthMiddleware = new JwtAuthMiddleware();

    // Protect all admin routes with JWT
    router.use('/admin', (req, res, next) => jwtAuthMiddleware.handle(req, res, next));

    registerAgentManagement(router);
    registerDeviceManagement(router);
    registerAttendanceIngestion(router);
    registerOrganizationManagement(router);

    return router;
}
