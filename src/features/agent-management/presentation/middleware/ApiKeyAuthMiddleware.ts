import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../../../shared/responses/ApiResponse.js';
import { AuthenticateAgentUseCase } from '../../application/usecases/AuthenticateAgentUseCase.js';
import { Agent } from '../../domain/entities/Agent.js';


export class ApiKeyAuthMiddleware {
    constructor(private readonly authenticateAgentUseCase: AuthenticateAgentUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const apiKey = req.headers['x-api-key'] as string;

            if (!apiKey) {
                res.status(StatusCodes.UNAUTHORIZED).json(
                    new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Authorization header missing')
                );
                return;
            }

            const agent = await this.authenticateAgentUseCase.execute(apiKey);

            if (!agent) {
                res.status(StatusCodes.UNAUTHORIZED).json(
                    new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Invalid API Key')
                );
                return;
            }

            req.agent = agent;
            next();
        } catch (error) {
            console.error('Authentication Error:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, null, 'Internal Authentication Error')
            );
        }
    }
}
