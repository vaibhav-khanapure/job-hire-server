import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import axios from 'axios';

const errorHandler = (): ErrorRequestHandler => {
    return (err: Error, _req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            next(err);
            return;
        };

        if (axios.isAxiosError<{ message?: unknown }>(err)) {
            const status = err.response?.status ?? 502;
            const responseMessage = err.response?.data?.message;

            const message = typeof responseMessage === 'string' ? responseMessage : 'External API request failed';

            res.status(status).json({ message });
            return;
        };

        const error = err as {
            status?: number;
            message?: string;
        };

        const status = error.status ?? 500;
        const message = status >= 500 ? 'Internal server error' : error.message ?? 'Request failed';

        res.status(status).json({ message });
        return;
    };
};

export default errorHandler;