import { SuperAdmin } from '../entities/SuperAdmin.js';

export interface ISuperAdminRepository {
  findByEmail(email: string): Promise<SuperAdmin | null>;
  create(admin: SuperAdmin): Promise<SuperAdmin>;
}