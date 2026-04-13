import { Request, Response, NextFunction } from 'express';
import ApiError from '../../shared/errors/ApiError.js';


export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const isApiError = err instanceof ApiError;

    const statusCode = isApiError ? err.statusCode : 500;
    const message = isApiError ? err.message : 'Internal Server Error';

    if (process.env.NODE_ENV !== 'prod') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors: isApiError ? err.errors : [],
        stack: process.env.NODE_ENV === 'prod' ? undefined : err.stack
    });
}
