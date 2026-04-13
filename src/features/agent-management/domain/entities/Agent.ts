import { randomUUID } from 'crypto';
import { AgentStatus } from '../enums/AgentStatus.js';

export class Agent {
    private apiKeyHash?: string;

    private constructor(
        public readonly id: string,
        public readonly orgId: string,
        public readonly orgName: string | undefined,
        public readonly branchId: string,
        public name: string,
        public readonly apiKey: string, // plain key (returned ONCE)
        status: AgentStatus,
        createdAt: Date,
        lastSeenAt: Date | null = null
    ) {
        this.status = status;
        this.createdAt = createdAt;
        this.lastSeenAt = lastSeenAt;
    }

    public status: AgentStatus;
    public readonly createdAt: Date;
    public lastSeenAt: Date | null;

    /**
     * Factory: create new agent
     * - Generates id
     * - Generates plain apiKey
     */
    static create(params: {
        orgId: string;
        branchId: string;
        name: string;
    }): Agent {
        if (!params.name || params.name.trim().length === 0) {
            throw new Error('Agent name is required');
        }

        return new Agent(
            randomUUID(),
            params.orgId,
            undefined,
            params.branchId,
            params.name,
            randomUUID(), // Generate plain API key
            AgentStatus.ACTIVE,
            new Date()
        );
    }

    /**
     * Rebuild from DB (NO plain apiKey here)
     */
    static fromPersistence(data: {
        id: string;
        orgId: string;
        orgName?: string;
        branchId: string;
        name: string;
        apiKeyHash: string;
        status: AgentStatus;
        createdAt: Date;
        lastSeenAt: Date | null;
    }): Agent {
        const agent = new Agent(
            data.id,
            data.orgId,
            data.orgName,
            data.branchId,
            data.name,
            '', // plain apiKey never comes from DB
            data.status,
            data.createdAt,
            data.lastSeenAt
        );

        agent.apiKeyHash = data.apiKeyHash;
        return agent;
    }


    /**
     * Domain-controlled mutation
     */
    setApiKeyHash(hash: string) {
        this.apiKeyHash = hash;
    }

    getApiKeyHash(): string {
        if (!this.apiKeyHash) {
            throw new Error('API key hash not set');
        }
        return this.apiKeyHash;
    }

    /**
     * Business behavior
     */
    deactivate(): void {
        if (this.status === AgentStatus.REVOKED) {
            throw new Error('Agent already revoked');
        }
        this.status = AgentStatus.REVOKED;
    }

    updateLastSeen(): void {
        this.lastSeenAt = new Date();
    }

    updateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Agent name cannot be empty');
        }
        (this as any).name = name;
    }
}
