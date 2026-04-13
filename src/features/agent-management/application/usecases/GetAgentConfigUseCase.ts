import { Agent } from '../../domain/entities/Agent.js';
import { AgentRepository } from '../../domain/repositories/AgentRepository.js';
import { DeviceRepository } from '../../../device-management/domain/repositories/DeviceRepository.js';

export class GetAgentConfigUseCase {
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
            agentId: agent.id,
            serverUrl: process.env.SERVER_URL || 'http://localhost:3040',
            syncInterval: 30000, // 30 seconds default
            devices: devices.map(device => ({
                id: device.id,
                ip: device.ip,
                port: device.port,
                serialNo: device.serialNo,
                model: device.model
            })),
            configVersion: `v1-${Date.now()}`
        };
    }
}
