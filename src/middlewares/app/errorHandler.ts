import type { NextFunction, Request, Response } from "express";
import type { AppError } from "../../types/error.types.js";
import axios from 'axios';

const errorHandler = () => {
    return (err: AppError, _: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) return next(err);

        if (axios.isAxiosError(err)) {
            const status = err?.status ?? 500;
            const message = err.response?.data?.message ?? 'External API request failed';

            return res.status(status).json({ message });
        };

        const status = err?.status ?? 500,
            message = status >= 500 ? 'Internal server error' : err?.message;

        return res.status(status).json({ message });
    };
};

export default errorHandler;