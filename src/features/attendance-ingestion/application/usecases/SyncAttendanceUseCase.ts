import { FileLogService } from '../../../../shared/services/FileLogService.js';
import { AgentRepository } from '../../../agent-management/domain/repositories/AgentRepository.js';

export class SyncAttendanceUseCase {
    constructor(
        private readonly fileLogService: FileLogService,
        private readonly agentRepository: AgentRepository
    ) { }

    async execute(params: {
        agentId: string;
        logs: Array<{
            userId: string;
            timestamp: string; // ISO string from JSON
            status: string;
            deviceId?: string;
        }>;
    }): Promise<void> {

        if (params.logs.length === 0) {
            return;
        }

        await this.fileLogService.appendLogs(params.agentId, params.logs);

        const agent = await this.agentRepository.findById(params.agentId);
        if (agent) {
            agent.updateLastSeen();
            await this.agentRepository.save(agent);
        }
    }
}

