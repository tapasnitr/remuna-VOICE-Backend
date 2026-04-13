import { DevoteeRepository } from "../../domain/repositories/devotee.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginUseCase {
  constructor(private repo: DevoteeRepository) {}

  async execute(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    if (user.status !== "APPROVED") {
      throw new Error("Not approved by admin");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return { token };
  }
}