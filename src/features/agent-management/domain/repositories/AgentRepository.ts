import { Agent } from '../entities/Agent.js';

export interface AgentRepository {
    save(agent: Agent): Promise<void>;

    findById(id: string): Promise<Agent | null>;

    findByApiKeyHash(hash: string): Promise<Agent | null>;

    findAll(): Promise<Agent[]>;

    delete(id: string): Promise<void>;

    getUsers(orgId: string): Promise<AgentUser[]>;
}


export interface AgentUser {
    id: string;
    userId: string;
    name: string;
    regdNo: string;
    cardNo: string;
    role: number;
}
