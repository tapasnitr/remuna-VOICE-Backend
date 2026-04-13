import { AgentRepository } from '../../domain/repositories/AgentRepository.js';

export class DeleteAgentUseCase {
    constructor(
        private readonly agentRepository: AgentRepository
    ) { }

    async execute(agentId: string): Promise<void> {
        const agent = await this.agentRepository.findById(agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }

        await this.agentRepository.delete(agentId);
    }
}
