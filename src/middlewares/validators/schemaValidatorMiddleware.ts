import type { NextFunction, Request, Response } from 'express';
import { ZodError, type z } from 'zod';

const schemaValidatorMiddleware = (schema: z.ZodType, type: 'query' | 'body' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req[type] ?? {});

            Object.assign(req, { [type]: validatedData });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error?.issues?.[0]?.message ?? 'Validation failed'
                });
            };

            next(error);
        };
    };
};

export default schemaValidatorMiddleware;