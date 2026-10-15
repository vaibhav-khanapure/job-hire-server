import type { NextFunction, Request, Response } from "express";

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { email, password } = req.body;

        // const user = await 
    } catch (error) {
        next(error);
    };
};

export default login;