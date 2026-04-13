import { createHash } from 'crypto';
import { ApiKeyHasher } from '../../domain/services/ApiKeyHasher.js';

export class Sha256ApiKeyHasher implements ApiKeyHasher {
    async hash(plain: string): Promise<string> {
        return createHash('sha256').update(plain).digest('hex');
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        const calculatedHash = await this.hash(plain);
        return calculatedHash === hash;
    }
}
