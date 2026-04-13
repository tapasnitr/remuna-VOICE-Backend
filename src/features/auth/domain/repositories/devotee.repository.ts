import { Devotee, DevoteeStatus } from "../entities/devotee.entity.js";

export interface DevoteeRepository {
  create(devotee: Devotee): Promise<Devotee>;
  findByEmail(email: string): Promise<Devotee | null>;
  findById(id: string): Promise<Devotee | null>;
  updateStatus(id: string, status: DevoteeStatus): Promise<void>;
}