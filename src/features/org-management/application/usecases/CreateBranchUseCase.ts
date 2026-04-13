import { Branch } from '../../domain/entities/Branch.js';
import { BranchRepository } from '../../domain/repositories/BranchRepository.js';

export class CreateBranchUseCase {
    constructor(private readonly branchRepository: BranchRepository) { }

    async execute(params: {
        orgId: string;
        name: string;
        address?: string;
    }): Promise<void> {

        const branch = Branch.create({
            orgId: params.orgId,
            name: params.name,
            address: params.address || null
        });

        await this.branchRepository.save(branch);
    }
}
