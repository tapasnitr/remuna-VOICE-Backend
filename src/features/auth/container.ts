import { DevoteeRepositoryImpl } from "./infrastructure/devotee.repository.impl.js";
import { SignupUseCase } from "./application/usecases/Signup.usecase.js";
import { LoginUseCase } from "./application/usecases/login.usecase.js";
import { ApproveDevoteeUseCase } from "./application/usecases/approve-devotee.usecase.js";
import { AuthController } from "./presentation/auth.controller.js";

const repo = new DevoteeRepositoryImpl();

export const authController = new AuthController(
  new SignupUseCase(repo),
  new LoginUseCase(repo),
  new ApproveDevoteeUseCase(repo)
);