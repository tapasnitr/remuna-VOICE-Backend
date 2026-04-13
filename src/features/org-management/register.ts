import { Router } from 'express';
import { buildOrganizationManagement } from './container.js';
import { OrganizationController } from './presentation/OrganizationController.js';
import { registerOrganizationRoutes } from './presentation/routes.js';

export function registerOrganizationManagement(router: Router) {
    const { createBranchUseCase, listBranchesUseCase, updateBranchUseCase, deleteBranchUseCase } = buildOrganizationManagement();
    const controller = new OrganizationController(createBranchUseCase, listBranchesUseCase, updateBranchUseCase, deleteBranchUseCase);

    registerOrganizationRoutes(router, controller);
}
