import { Branch } from '../entities/Branch.js';

export interface BranchRepository {
    save(branch: Branch): Promise<void>;
    listByOrgId(orgId: string): Promise<Branch[]>;
    findById(id: string): Promise<Branch | null>;
    update(branch: Branch): Promise<void>;
    delete(id: string): Promise<void>;
}
