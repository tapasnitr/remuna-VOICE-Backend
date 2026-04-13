import bcrypt from 'bcrypt';
import { ApiKeyHasher } from '../../domain/services/ApiKeyHasher.js';

export class BcryptApiKeyHasher implements ApiKeyHasher {
    private readonly SALT_ROUNDS = 12;

    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, this.SALT_ROUNDS);
    }

    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}