import { Agent } from '../../domain/entities/Agent.js';
import { AgentRepository } from '../../domain/repositories/AgentRepository.js';
import { ApiKeyHasher } from '../../domain/services/ApiKeyHasher.js';

export class CreateAgentUseCase {
    constructor(
        private readonly agentRepository: AgentRepository,
        private readonly apiKeyHasher: ApiKeyHasher
    ) { }

    async execute(input: {
        orgId: string;
        branchId: string;
        name: string;
    }) {
        const agent = Agent.create({
            orgId: input.orgId,
            branchId: input.branchId,
            name: input.name,
        });

        const hashedKey = await this.apiKeyHasher.hash(agent.apiKey);

        agent.setApiKeyHash(hashedKey);

        await this.agentRepository.save(agent);

        return {
            id: agent.id,
            name: agent.name,
            apiKey: agent.apiKey
        };
    }
}
