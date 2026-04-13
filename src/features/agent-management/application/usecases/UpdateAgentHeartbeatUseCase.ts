import { Agent } from '../../domain/entities/Agent.js';
import { AgentRepository } from '../../domain/repositories/AgentRepository.js';

export class UpdateAgentHeartbeatUseCase {
    constructor(
        private readonly agentRepository: AgentRepository
    ) { }

    async execute(params: {
        agentId: string;
        deviceStatuses?: Array<{
            deviceId: string;
            status: string;
            lastSync?: string;
            errorMessage?: string | null;
        }>;
    }): Promise<void> {
        const agent = await this.agentRepository.findById(params.agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }

        agent.updateLastSeen();
        await this.agentRepository.save(agent);
    }
}
