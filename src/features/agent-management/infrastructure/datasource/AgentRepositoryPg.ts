import { prisma } from '../../../../shared/infrastructure/datasource/postgres/PgPool.js';
import { Agent } from '../../domain/entities/Agent.js';
import { AgentRepository } from '../../domain/repositories/AgentRepository.js';
import { AgentStatus } from '../../domain/enums/AgentStatus.js';

export class AgentRepositoryPrisma implements AgentRepository {

    async save(agent: Agent): Promise<void> {
        await prisma.attendance_agents.upsert({
            where: { id: agent.id },
            create: {
                id: agent.id,
                orgId: agent.orgId,
                branchId: agent.branchId,
                name: agent.name,
                apiKeyHash: agent.getApiKeyHash(),
                status: agent.status,
                createdAt: agent.createdAt,
                lastSeenAt: agent.lastSeenAt,
            },
            update: {
                status: agent.status,
                lastSeenAt: agent.lastSeenAt,
            },
        });
    }

    async findById(id: string): Promise<Agent | null> {
        const row = await prisma.attendance_agents.findUnique({
            where: { id },
            include: { Organizations: true },
        });

        if (!row) {
            return null;
        }

        return Agent.fromPersistence({
            id: row.id,
            orgId: row.orgId,
            orgName: row.Organizations?.name,
            branchId: row.branchId,
            name: row.name,
            apiKeyHash: row.apiKeyHash,
            status: row.status as AgentStatus,
            createdAt: row.createdAt,
            lastSeenAt: row.lastSeenAt,
        });
    }

    async findByApiKeyHash(hash: string): Promise<Agent | null> {
        let row;
        try {
            row = await prisma.attendance_agents.findFirst({
                where: { apiKeyHash: hash },
            });
        } catch (error) {
            console.log(error);
        }

        if (!row) {
            return null;
        }

        return Agent.fromPersistence({
            id: row.id,
            orgId: row.orgId,
            branchId: row.branchId,
            name: row.name,
            apiKeyHash: row.apiKeyHash,
            status: row.status as AgentStatus,
            createdAt: row.createdAt,
            lastSeenAt: row.lastSeenAt,
        });
    }

    async findAll(): Promise<Agent[]> {
        const rows = await prisma.attendance_agents.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return rows.map(row => Agent.fromPersistence({
            id: row.id,
            orgId: row.orgId,
            branchId: row.branchId,
            name: row.name,
            apiKeyHash: row.apiKeyHash,
            status: row.status as AgentStatus,
            createdAt: row.createdAt,
            lastSeenAt: row.lastSeenAt,
        }));
    }

    async delete(id: string): Promise<void> {
        await prisma.attendance_agents.delete({
            where: { id }
        });
    }

    async getUsers(orgId: string): Promise<import("../../domain/repositories/AgentRepository.js").AgentUser[]> {
        const users = await prisma.users.findMany({
            where: {
                regdBy: orgId,
                status: 1,
                userType: "STUDENT"
            },
            include: {
                StudentDetails: true
            }
        });

        return users.map(u => ({
            id: u.id,
            userId: u.userId,
            name: u.name,
            regdNo: u.StudentDetails?.regdNo || '',
            cardNo: u.StudentDetails?.regdNo || '',
            role: u.role
        }));
    }
}
