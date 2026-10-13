import type { NextFunction, Request, Response } from "express";

const login = (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error);
    };
};

export default login;