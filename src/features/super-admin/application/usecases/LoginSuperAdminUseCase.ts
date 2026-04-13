import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ISuperAdminRepository } from '../../domain/repositories/ISuperAdminRepository.js';

export class LoginSuperAdminUseCase {
  constructor(private repo: ISuperAdminRepository) {}

  async execute(email: string, password: string) {

    if (!email || !password) {
      throw new Error('Email & password required');
    }

    const admin = await this.repo.findByEmail(email);

    if (!admin) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    };
  }
}