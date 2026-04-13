import fs from 'fs';
import path from 'path';

export class FileLogService {
    private readonly stagingDir: string;

    constructor() {
        this.stagingDir = path.join(process.cwd(), 'storage', 'staging');
        if (!fs.existsSync(this.stagingDir)) {
            fs.mkdirSync(this.stagingDir, { recursive: true });
        }
    }

    private getFilePath(agentId: string): string {
        return path.join(this.stagingDir, `PENDING_LOGS_${agentId}.json`);
    }

    async appendLogs(agentId: string, logs: any[]): Promise<void> {
        const filePath = this.getFilePath(agentId);
        let existingLogs: any[] = [];

        if (fs.existsSync(filePath)) {
            try {
                const fileContent = await fs.promises.readFile(filePath, 'utf-8');
                existingLogs = JSON.parse(fileContent);
            } catch (error) {
                console.error(`Error reading staging file for agent ${agentId}:`, error);
            }
        }

        const updatedLogs = existingLogs.concat(logs);
        await fs.promises.writeFile(filePath, JSON.stringify(updatedLogs, null, 2));
    }

    async getPendingLogs(agentId: string): Promise<any[]> {
        const filePath = this.getFilePath(agentId);
        if (!fs.existsSync(filePath)) {
            return [];
        }

        try {
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error reading staging file for agent ${agentId}:`, error);
            return [];
        }
    }

    async clearLogs(agentId: string): Promise<void> {
        const filePath = this.getFilePath(agentId);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    }

    async getPendingCount(agentId: string): Promise<number> {
        const logs = await this.getPendingLogs(agentId);
        return logs.length;
    }
}
