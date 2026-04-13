import { Request, Response } from "express";

export class AuthController {
  constructor(
    private signupUseCase: any,
    private loginUseCase: any,
    private approveUseCase: any
  ) {}

  signup = async (req: Request, res: Response) => {
    const { name, email, password, dob } = req.body;
    const result = await this.signupUseCase.execute(
      name,
      email,
      password,
      new Date(dob)
    );
    res.json(result);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.loginUseCase.execute(email, password);
    res.json(result);
  };

  approve = async (req: Request, res: Response) => {
    await this.approveUseCase.execute(req.params.id);
    res.json({ message: "Approved" });
  };
}