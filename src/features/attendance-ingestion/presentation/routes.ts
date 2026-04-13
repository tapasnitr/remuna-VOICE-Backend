import { Router } from 'express';
import { AttendanceController } from './AttendanceController.js';
import { buildAttendanceIngestion } from '../container.js';

export function registerAttendanceRoutes(
    router: Router,
    controller: AttendanceController
) {
    const { apiKeyAuthMiddleware } = buildAttendanceIngestion();

    router.post(
        '/attendance/sync',
        (req, res, next) => apiKeyAuthMiddleware.handle(req, res, next),
        (req, res, next) => controller.sync(req, res, next)
    );

    router.get(
        '/attendance/count',
        (req, res, next) => apiKeyAuthMiddleware.handle(req, res, next),
        (req, res, next) => controller.getPendingCount(req, res, next)
    );

    // Admin Routes (No API Key needed for now, follows existing pattern)
    router.get('/admin/attendance/:agentId/count', (req, res, next) => controller.getPendingCount(req, res, next));
    router.post('/admin/attendance/:agentId/commit', (req, res, next) => controller.commit(req, res, next));

    router.post(
        '/attendance/commit',
        (req, res, next) => apiKeyAuthMiddleware.handle(req, res, next),
        (req, res, next) => controller.commit(req, res, next)
    );

    // Admin query: fetch attendance by group and date
    // GET /admin/attendance/group?groupId=<groupId>&date=<YYYY-MM-DD>
    router.get('/admin/attendance/group', (req, res, next) => controller.getByGroupAndDate(req, res, next));
}
