import { AgentRepository } from '../../domain/repositories/AgentRepository.js';
import { DeviceRepository } from '../../../device-management/domain/repositories/DeviceRepository.js';

export class GetAgentDetailsUseCase {
    constructor(
        private readonly agentRepository: AgentRepository,
        private readonly deviceRepository: DeviceRepository
    ) { }

    async execute(agentId: string) {
        const agent = await this.agentRepository.findById(agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }

        const devices = await this.deviceRepository.findByAgentId(agentId);

        return {
            id: agent.id,
            name: agent.name,
            orgId: agent.orgId,
            orgName: agent.orgName,
            branchId: agent.branchId,
            status: this.getAgentStatus(agent.lastSeenAt),
            lastSeenAt: agent.lastSeenAt,
            createdAt: agent.createdAt,
            devices: devices.map(device => ({
                id: device.id,
                ip: device.ip,
                port: device.port,
                serialNo: device.serialNo,
                model: device.model,
                status: device.status,
                lastSeenAt: device.lastSeenAt
            }))
        };
    }

    private getAgentStatus(lastSeenAt: Date | null): 'online' | 'offline' {
        if (!lastSeenAt) return 'offline';

        const now = new Date();
        const diffMs = now.getTime() - lastSeenAt.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        return diffMinutes < 5 ? 'online' : 'offline';
    }
}
