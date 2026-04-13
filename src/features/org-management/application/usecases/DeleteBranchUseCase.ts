import { BranchRepository } from '../../domain/repositories/BranchRepository.js';

export class DeleteBranchUseCase {
    constructor(private readonly branchRepository: BranchRepository) { }

    async execute(id: string): Promise<void> {
        const branch = await this.branchRepository.findById(id);
        if (!branch) {
            throw new Error('Branch not found');
        }

        await this.branchRepository.delete(id);
    }
}
