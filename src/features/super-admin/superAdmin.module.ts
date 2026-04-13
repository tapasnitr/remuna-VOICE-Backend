import { SuperAdminRepository } from './infrastructure/repositories/SuperAdminRepository.js';
import { CreateSuperAdminUseCase } from './application/usecases/CreateSuperAdminUseCase.js';
import { LoginSuperAdminUseCase } from './application/usecases/LoginSuperAdminUseCase.js';
import { SuperAdminController } from './presentation/controllers/SuperAdminController.js';

const repo = new SuperAdminRepository();

const createUseCase = new CreateSuperAdminUseCase(repo);
const loginUseCase = new LoginSuperAdminUseCase(repo);

export const superAdminController = new SuperAdminController(
  createUseCase,
  loginUseCase
);