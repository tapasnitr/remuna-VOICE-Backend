import { Router } from 'express';
import { OrganizationController } from './OrganizationController.js';

export function registerOrganizationRoutes(
    router: Router,
    controller: OrganizationController
) {
    router.post(
        '/admin/branches',
        (req, res, next) => controller.createBranch(req, res, next)
    );

    router.get(
        '/admin/branches',
        (req, res, next) => controller.listBranches(req, res, next)
    );

    router.put(
        '/admin/branches/:branchId',
        (req, res, next) => controller.updateBranch(req, res, next)
    );

    router.delete(
        '/admin/branches/:branchId',
        (req, res, next) => controller.deleteBranch(req, res, next)
    );
}
