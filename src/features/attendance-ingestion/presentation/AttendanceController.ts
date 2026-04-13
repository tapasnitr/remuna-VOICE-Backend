import { Request, Response, NextFunction } from 'express';
import { SyncAttendanceUseCase } from '../application/usecases/SyncAttendanceUseCase.js';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/responses/ApiResponse.js';
import { Agent } from '../../agent-management/domain/entities/Agent.js';

import { CommitAttendanceUseCase } from '../application/usecases/CommitAttendanceUseCase.js';
import { GetAttendanceByGroupUseCase } from '../application/usecases/GetAttendanceByGroupUseCase.js';

export class AttendanceController {
    constructor(
        private readonly syncAttendanceUseCase: SyncAttendanceUseCase,
        private readonly commitAttendanceUseCase: CommitAttendanceUseCase,
        private readonly getAttendanceByGroupUseCase: GetAttendanceByGroupUseCase
    ) { }

    async sync(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const agent = req.agent;
            if (!agent) {
                res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Agent not authenticated'));
                return;
            }

            const logs = req.body;
            if (!Array.isArray(logs)) {
                res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Invalid payload: expected array of logs'));
                return;
            }

            await this.syncAttendanceUseCase.execute({
                agentId: agent.id,
                logs
            });

            res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { count: logs.length }, 'Attendance staged successfully'));
        } catch (error: any) {
            next(error);
        }
    }

    async getPendingCount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let agentId = req.params.agentId as string;

            if (!agentId && req.agent) {
                agentId = req.agent.id;
            }

            if (!agentId) {
                res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Agent ID required'));
                return;
            }

            const count = await this.commitAttendanceUseCase.getPendingCount(agentId);
            res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { count }, 'Pending logs count fetched'));
        } catch (error: any) {
            next(error);
        }
    }

    async commit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let agentId = req.params.agentId as string;

            if (!agentId && req.agent) {
                agentId = req.agent.id;
            }

            if (!agentId) {
                res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Agent ID required'));
                return;
            }

            const committedCount = await this.commitAttendanceUseCase.execute(agentId);
            res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { count: committedCount }, 'Logs committed to DB successfully'));
        } catch (error: any) {
            next(error);
        }
    }

    async getByGroupAndDate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const groupIdParam = req.query.groupId as string;
            const dateParam = req.query.date as string;

            if (!groupIdParam || !dateParam) {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'groupId and date query params are required')
                );
                return;
            }

            const groupId = parseInt(groupIdParam, 10);
            if (isNaN(groupId)) {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'groupId must be a valid integer')
                );
                return;
            }

            const date = new Date(dateParam);
            if (isNaN(date.getTime())) {
                res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiResponse(StatusCodes.BAD_REQUEST, null, 'date must be a valid date in YYYY-MM-DD format')
                );
                return;
            }

            const records = await this.getAttendanceByGroupUseCase.execute(groupId, date);
            res.status(StatusCodes.OK).json(
                new ApiResponse(StatusCodes.OK, { records, count: records.length }, 'Attendance fetched successfully')
            );
        } catch (error: any) {
            next(error);
        }
    }
}
