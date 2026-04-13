import { AgentRepositoryPrisma } from './infrastructure/datasource/AgentRepositoryPg.js';
import { CreateAgentUseCase } from './application/usecases/CreateAgentUseCase.js';
import { GetAgentConfigUseCase } from './application/usecases/GetAgentConfigUseCase.js';
import { UpdateAgentHeartbeatUseCase } from './application/usecases/UpdateAgentHeartbeatUseCase.js';
import { ListAgentsUseCase } from './application/usecases/ListAgentsUseCase.js';
import { GetAgentDetailsUseCase } from './application/usecases/GetAgentDetailsUseCase.js';
import { UpdateAgentUseCase } from './application/usecases/UpdateAgentUseCase.js';
import { DeleteAgentUseCase } from './application/usecases/DeleteAgentUseCase.js';
import { Sha256ApiKeyHasher } from './infrastructure/security/Sha256ApiKeyHasher.js';
import { AuthenticateAgentUseCase } from './application/usecases/AuthenticateAgentUseCase.js';
import { ApiKeyAuthMiddleware } from './presentation/middleware/ApiKeyAuthMiddleware.js';
import { DeviceRepositoryPrisma } from '../device-management/infrastructure/datasource/DeviceRepositoryPrisma.js';
import { GetAgentUsersUseCase } from './application/usecases/GetAgentUsersUseCase.js';

export function buildAgentManagement() {
    const agentRepository = new AgentRepositoryPrisma();
    const deviceRepository = new DeviceRepositoryPrisma();
    const apiKeyHasher = new Sha256ApiKeyHasher();

    const createAgentUseCase = new CreateAgentUseCase(agentRepository, apiKeyHasher);
    const getAgentConfigUseCase = new GetAgentConfigUseCase(agentRepository, deviceRepository);
    const updateAgentHeartbeatUseCase = new UpdateAgentHeartbeatUseCase(agentRepository);
    const listAgentsUseCase = new ListAgentsUseCase(agentRepository);
    const getAgentDetailsUseCase = new GetAgentDetailsUseCase(agentRepository, deviceRepository);
    const updateAgentUseCase = new UpdateAgentUseCase(agentRepository);
    const deleteAgentUseCase = new DeleteAgentUseCase(agentRepository);
    const authenticateAgentUseCase = new AuthenticateAgentUseCase(agentRepository, apiKeyHasher);
    const getAgentUsersUseCase = new GetAgentUsersUseCase(agentRepository);

    const apiKeyAuthMiddleware = new ApiKeyAuthMiddleware(authenticateAgentUseCase);

    return {
        createAgentUseCase,
        getAgentConfigUseCase,
        updateAgentHeartbeatUseCase,
        listAgentsUseCase,
        getAgentDetailsUseCase,
        updateAgentUseCase,
        deleteAgentUseCase,
        authenticateAgentUseCase,
        getAgentUsersUseCase,
        apiKeyAuthMiddleware
    };
}
