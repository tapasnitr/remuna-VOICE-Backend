import { Device } from '../entities/Device.js';

export interface DeviceRepository {
    save(device: Device): Promise<void>;
    findById(id: string): Promise<Device | null>;
    findBySerialNo(serialNo: string): Promise<Device | null>;
    findByAgentId(agentId: string): Promise<Device[]>;
    delete(id: string): Promise<void>;
}
