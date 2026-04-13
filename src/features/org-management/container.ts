import { BranchRepositoryPrisma } from './infrastructure/datasource/BranchRepositoryPrisma.js';
import { CreateBranchUseCase } from './application/usecases/CreateBranchUseCase.js';
import { ListBranchesUseCase } from './application/usecases/ListBranchesUseCase.js';

import { UpdateBranchUseCase } from './application/usecases/UpdateBranchUseCase.js';
import { DeleteBranchUseCase } from './application/usecases/DeleteBranchUseCase.js';

export function buildOrganizationManagement() {
    const branchRepository = new BranchRepositoryPrisma();
    const createBranchUseCase = new CreateBranchUseCase(branchRepository);
    const listBranchesUseCase = new ListBranchesUseCase(branchRepository);
    const updateBranchUseCase = new UpdateBranchUseCase(branchRepository);
    const deleteBranchUseCase = new DeleteBranchUseCase(branchRepository);

    return {
        createBranchUseCase,
        listBranchesUseCase,
        updateBranchUseCase,
        deleteBranchUseCase
    };
}
