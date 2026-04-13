import bcrypt from 'bcrypt';
import { createSuperAdmin, findByEmail } from '../infrastructure/superAdmin.repository.js';

export const createSuperAdminUseCase = async (name: string, email: string, password: string) => {
  const existing = await findByEmail(email);

  if (existing) {
    throw new Error('Super admin already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await createSuperAdmin({
    name,
    email,
    password: hashedPassword,
  });
};