import { Agent } from '../../domain/entities/Agent.js';
import { AgentRepository } from '../../domain/repositories/AgentRepository.js';
import { ApiKeyHasher } from '../../domain/services/ApiKeyHasher.js';

export class AuthenticateAgentUseCase {
    constructor(
        private readonly agentRepository: AgentRepository,
        private readonly apiKeyHasher: ApiKeyHasher
    ) { }

    async execute(plainApiKey: string): Promise<Agent | null> {
        if (!plainApiKey) {
            return null;
        }

        const hash = await this.apiKeyHasher.hash(plainApiKey);
        const agent = await this.agentRepository.findByApiKeyHash(hash);

        if (!agent) {
            return null;
        }

        return agent;
    }
}
