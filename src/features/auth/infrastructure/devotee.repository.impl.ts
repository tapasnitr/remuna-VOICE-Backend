import { PrismaClient } from "@prisma/client";
import { DevoteeRepository } from "../domain/repositories/devotee.repository.js";
import { Devotee } from "../domain/entities/devotee.entity.js";

const prisma = new PrismaClient();

export class DevoteeRepositoryImpl implements DevoteeRepository {

  private toDomain(data: any): Devotee {
    return new Devotee(
      data.id,
      data.name,
      data.email,
      data.password,
      data.status,
      data.dob,
      data.createdAt
    );
  }

  async create(devotee: Devotee): Promise<Devotee> {
    const data = await prisma.devotee.create({
      data: {
        id: devotee.id,
        name: devotee.name,
        email: devotee.email,
        password: devotee.password,
        status: devotee.status,
        dob: devotee.dob,
      },
    });

    return this.toDomain(data);
  }

  async findByEmail(email: string) {
    const data = await prisma.devotee.findUnique({ where: { email } });
    return data ? this.toDomain(data) : null;
  }

  async findById(id: string) {
    const data = await prisma.devotee.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async updateStatus(id: string, status: string) {
    await prisma.devotee.update({
      where: { id },
      data: { status },
    });
  }
}