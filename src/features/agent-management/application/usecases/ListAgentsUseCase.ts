import { AgentRepository } from '../../domain/repositories/AgentRepository.js';

export class ListAgentsUseCase {
    constructor(
        private readonly agentRepository: AgentRepository
    ) { }

    async execute() {
        const agents = await this.agentRepository.findAll();

        return agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            orgId: agent.orgId,
            branchId: agent.branchId,
            status: this.getAgentStatus(agent.lastSeenAt),
            lastSeenAt: agent.lastSeenAt,
            createdAt: agent.createdAt
        }));
    }

    private getAgentStatus(lastSeenAt: Date | null): 'online' | 'offline' {
        if (!lastSeenAt) return 'offline';

        const now = new Date();
        const diffMs = now.getTime() - lastSeenAt.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        return diffMinutes < 5 ? 'online' : 'offline';
    }
}
