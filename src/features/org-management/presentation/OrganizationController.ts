import { Request, Response, NextFunction } from 'express';
import { CreateBranchUseCase } from '../application/usecases/CreateBranchUseCase.js';
import { ListBranchesUseCase } from '../application/usecases/ListBranchesUseCase.js';
import { UpdateBranchUseCase } from '../application/usecases/UpdateBranchUseCase.js';
import { DeleteBranchUseCase } from '../application/usecases/DeleteBranchUseCase.js';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../shared/responses/ApiResponse.js';

export class OrganizationController {
    constructor(
        private readonly createBranchUseCase: CreateBranchUseCase,
        private readonly listBranchesUseCase: ListBranchesUseCase,
        private readonly updateBranchUseCase: UpdateBranchUseCase,
        private readonly deleteBranchUseCase: DeleteBranchUseCase
    ) { }

    async createBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orgId = (req as any).user?.orgId;
            const { name, address } = req.body;

            if (!orgId) {
                res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Organization ID not found in token'));
                return;
            }

            if (!name) {
                res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Name is required'));
                return;
            }

            await this.createBranchUseCase.execute({
                orgId,
                name,
                address
            });

            res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, null, 'Branch created successfully'));
        } catch (error: any) {
            next(error);
        }
    }

    async listBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orgId = (req as any).user?.orgId;

            if (!orgId) {
                res.status(StatusCodes.UNAUTHORIZED).json(new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Organization ID not found in token'));
                return;
            }

            const branches = await this.listBranchesUseCase.execute(orgId);

            res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, branches, 'Branches retrieved successfully'));
        } catch (error: any) {
            next(error);
        }
    }

    async updateBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { branchId } = req.params;
            const { name, address, isActive } = req.body;

            await this.updateBranchUseCase.execute({
                id: branchId as string,
                name,
                address,
                isActive
            });

            res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, 'Branch updated successfully'));
        } catch (error: any) {
            next(error);
        }
    }

    async deleteBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { branchId } = req.params;

            await this.deleteBranchUseCase.execute(branchId as string);

            res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, 'Branch deleted successfully'));
        } catch (error: any) {
            next(error);
        }
    }
}
