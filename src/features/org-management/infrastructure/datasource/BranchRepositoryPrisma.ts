import { prisma } from '../../../../shared/infrastructure/datasource/postgres/PgPool.js';
import { Branch } from '../../domain/entities/Branch.js';
import { BranchRepository } from '../../domain/repositories/BranchRepository.js';

export class BranchRepositoryPrisma implements BranchRepository {
    async save(branch: Branch): Promise<void> {
        await prisma.branch.create({
            data: {
                orgId: branch.orgId,
                name: branch.name,
                address: branch.address,
                isActive: branch.isActive,
            }
        });
    }

    async listByOrgId(orgId: string): Promise<Branch[]> {
        const rows = await prisma.branch.findMany({
            where: { orgId }
        });

        return rows.map((row: any) => Branch.fromPersistence(row));
    }

    async findById(id: string): Promise<Branch | null> {
        const row = await prisma.branch.findUnique({
            where: { id }
        });

        if (!row) return null;

        return Branch.fromPersistence(row as any);
    }

    async update(branch: Branch): Promise<void> {
        await prisma.branch.update({
            where: { id: branch.id },
            data: {
                name: branch.name,
                address: branch.address,
                isActive: branch.isActive,
            }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.branch.delete({
            where: { id }
        });
    }
}
