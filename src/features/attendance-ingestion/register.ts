import { Router } from 'express';
import { buildAttendanceIngestion } from './container.js';
import { AttendanceController } from './presentation/AttendanceController.js';
import { registerAttendanceRoutes } from './presentation/routes.js';

export function registerAttendanceIngestion(router: Router) {
    const { syncAttendanceUseCase, commitAttendanceUseCase, getAttendanceByGroupUseCase } = buildAttendanceIngestion();
    const controller = new AttendanceController(syncAttendanceUseCase, commitAttendanceUseCase, getAttendanceByGroupUseCase);

    registerAttendanceRoutes(router, controller);
}
