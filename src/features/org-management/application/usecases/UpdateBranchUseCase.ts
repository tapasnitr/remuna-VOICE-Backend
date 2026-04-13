import { BranchRepository } from '../../domain/repositories/BranchRepository.js';
import { Branch } from '../../domain/entities/Branch.js';

export class UpdateBranchUseCase {
    constructor(private readonly branchRepository: BranchRepository) { }

    async execute(params: {
        id: string;
        name?: string;
        address?: string;
        isActive?: boolean;
    }): Promise<void> {
        const branch = await this.branchRepository.findById(params.id);
        if (!branch) {
            throw new Error('Branch not found');
        }

        const updatedBranch = Branch.fromPersistence({
            ...branch,
            name: params.name ?? branch.name,
            address: params.address !== undefined ? params.address : branch.address,
            isActive: params.isActive ?? branch.isActive
        });

        await this.branchRepository.update(updatedBranch);
    }
}
