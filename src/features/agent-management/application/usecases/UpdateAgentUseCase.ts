import { AgentRepository } from '../../domain/repositories/AgentRepository.js';

interface UpdateAgentDTO {
    id: string;
    name?: string;
}

export class UpdateAgentUseCase {
    constructor(
        private readonly agentRepository: AgentRepository
    ) { }

    async execute(dto: UpdateAgentDTO) {
        const agent = await this.agentRepository.findById(dto.id);
        if (!agent) {
            throw new Error('Agent not found');
        }

        if (dto.name) {
            agent.updateName(dto.name);
        }

        await this.agentRepository.save(agent);

        return {
            id: agent.id,
            name: agent.name,
            orgId: agent.orgId,
            branchId: agent.branchId,
            status: agent.status,
            lastSeenAt: agent.lastSeenAt,
            createdAt: agent.createdAt
        };
    }
}
