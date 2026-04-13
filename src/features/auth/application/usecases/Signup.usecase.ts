import { Devotee, DevoteeStatus } from "../../domain/entities/devotee.entity.js";
import { DevoteeRepository } from "../../domain/repositories/devotee.repository.js";
import bcrypt from "bcrypt";

export class SignupUseCase {
  constructor(private repo: DevoteeRepository) {}

  async execute(name: string, email: string, password: string, dob: Date) {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const devotee = new Devotee(
      crypto.randomUUID(),
      name,
      email,
      hashed,
      DevoteeStatus.PENDING,
      dob,
      new Date()
    );

    return this.repo.create(devotee);
  }
}