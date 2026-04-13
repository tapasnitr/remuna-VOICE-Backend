import { Branch } from '../../domain/entities/Branch.js';
import { BranchRepository } from '../../domain/repositories/BranchRepository.js';

export class ListBranchesUseCase {
    constructor(private readonly branchRepository: BranchRepository) { }

    async execute(orgId: string): Promise<Branch[]> {
        return this.branchRepository.listByOrgId(orgId);
    }
}
