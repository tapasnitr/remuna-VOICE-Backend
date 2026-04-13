import { AgentRepository, AgentUser } from '../../domain/repositories/AgentRepository.js';

export class GetAgentUsersUseCase {
    constructor(
        private readonly agentRepository: AgentRepository
    ) { }

    async execute(agentId: string): Promise<AgentUser[]> {
        const agent = await this.agentRepository.findById(agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }

        return this.agentRepository.getUsers(agent.orgId);
    }
}
