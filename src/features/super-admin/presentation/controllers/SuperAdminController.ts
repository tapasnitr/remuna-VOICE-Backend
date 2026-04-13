import { Request, Response } from 'express';
import { CreateSuperAdminUseCase } from '../../application/usecases/CreateSuperAdminUseCase.js';
import { LoginSuperAdminUseCase } from '../../application/usecases/LoginSuperAdminUseCase.js';

export class SuperAdminController {

  constructor(
    private createUseCase: CreateSuperAdminUseCase,
    private loginUseCase: LoginSuperAdminUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const data = await this.createUseCase.execute(name, email, password);

      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const data = await this.loginUseCase.execute(email, password);

      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}