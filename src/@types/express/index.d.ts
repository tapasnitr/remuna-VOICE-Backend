import { Agent } from '../../features/agent-management/domain/entities/Agent';
import { JwtPayload } from '../../presentation/middleware/JwtAuthMiddleware';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            agent?: Agent;
        }
    }
}
