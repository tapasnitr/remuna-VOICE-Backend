import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../shared/responses/ApiResponse.js';

export interface JwtPayload {
    id: string;
    email: string;
    role: number;
    orgId?: string;
    [key: string]: any;
}


export class JwtAuthMiddleware {
    private readonly secret: string;

    constructor() {
        this.secret = process.env.ACCESS_TOKEN_SECRET || 'default-secret';
        if (process.env.NODE_ENV === 'production' && this.secret === 'default-secret') {
            console.warn('WARNING: ACCESS_TOKEN_SECRET is not set in production. Using a default secret is insecure.');
        }
    }

    handle(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(StatusCodes.UNAUTHORIZED).json(
                new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Authorization token missing or invalid format')
            );
            return;
        }

        try {
            const decoded = jwt.verify(token, this.secret) as JwtPayload;
            req.user = decoded;
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error);
            res.status(StatusCodes.UNAUTHORIZED).json(
                new ApiResponse(StatusCodes.UNAUTHORIZED, null, 'Invalid or expired token')
            );
        }
    }
}
