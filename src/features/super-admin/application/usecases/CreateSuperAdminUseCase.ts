import bcrypt from 'bcrypt';
import { ISuperAdminRepository } from '../../domain/repositories/ISuperAdminRepository.js';
import { SuperAdmin } from '../../domain/entities/SuperAdmin.js';

export class CreateSuperAdminUseCase {
  constructor(private repo: ISuperAdminRepository) {}

  async execute(name: string, email: string, password: string) {

    if (!name || !email || !password) {
      throw new Error('All fields required');
    }

    const existing = await this.repo.findByEmail(email);

    if (existing) {
      throw new Error('Super admin already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new SuperAdmin('', name, email, hashedPassword);

    return await this.repo.create(admin);
  }
}