import type { NextFunction, Request, Response } from 'express';
import { ZodError, type z } from 'zod';

const schemaValidatorMiddleware = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body ?? {});

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.issues?.[0]?.message ?? 'Some Error Occurred',
                });
            };

            next(error);
        };
    };
};

export default schemaValidatorMiddleware;