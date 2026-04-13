import { prisma } from '../../../../shared/prisma/client.js';
import { ISuperAdminRepository } from '../../domain/repositories/ISuperAdminRepository.js';
import { SuperAdmin } from '../../domain/entities/SuperAdmin.js';

export class SuperAdminRepository implements ISuperAdminRepository {

  async findByEmail(email: string): Promise<SuperAdmin | null> {
    const data = await prisma.superAdmin.findUnique({
      where: { email }
    });

    if (!data) return null;

    return new SuperAdmin(data.id, data.name, data.email, data.password);
  }

  async create(admin: SuperAdmin): Promise<SuperAdmin> {
    const data = await prisma.superAdmin.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: admin.password
      }
    });

    return new SuperAdmin(data.id, data.name, data.email, data.password);
  }
}