import { AttendanceRepositoryPrisma } from './infrastructure/datasource/AttendanceRepositoryPrisma.js';
import { SyncAttendanceUseCase } from './application/usecases/SyncAttendanceUseCase.js';
import { CommitAttendanceUseCase } from './application/usecases/CommitAttendanceUseCase.js';
import { GetAttendanceByGroupUseCase } from './application/usecases/GetAttendanceByGroupUseCase.js';
import { buildAgentManagement } from '../agent-management/container.js';
import { buildDeviceManagement } from '../device-management/container.js';
import { FileLogService } from '../../shared/services/FileLogService.js';
import { AgentRepositoryPrisma } from '../agent-management/infrastructure/datasource/AgentRepositoryPg.js';

export function buildAttendanceIngestion() {
    const attendanceRepository = new AttendanceRepositoryPrisma();
    const fileLogService = new FileLogService();
    const agentRepository = new AgentRepositoryPrisma();
    const { deviceRepository } = buildDeviceManagement();

    const syncAttendanceUseCase = new SyncAttendanceUseCase(fileLogService, agentRepository);

    const commitAttendanceUseCase = new CommitAttendanceUseCase(
        attendanceRepository,
        fileLogService,
        deviceRepository
    );

    const getAttendanceByGroupUseCase = new GetAttendanceByGroupUseCase(attendanceRepository);

    const { apiKeyAuthMiddleware } = buildAgentManagement();

    return {
        syncAttendanceUseCase,
        commitAttendanceUseCase,
        getAttendanceByGroupUseCase,
        apiKeyAuthMiddleware
    };
}
