import { DevoteeRepository } from "../../domain/repositories/devotee.repository.js";
import { DevoteeStatus } from "../../domain/entities/devotee.entity.js";

export class ApproveDevoteeUseCase {
  constructor(private repo: DevoteeRepository) {}

  async execute(id: string) {
    await this.repo.updateStatus(id, DevoteeStatus.APPROVED);
  }
}