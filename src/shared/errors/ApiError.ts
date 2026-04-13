class ApiError extends Error {
    statusCode: number;
    data: null;
    errors: unknown[];
    success: false;

    constructor(
        statusCode: number,
        message = 'Something went wrong',
        errors: unknown[] = [],
        stack?: string
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
