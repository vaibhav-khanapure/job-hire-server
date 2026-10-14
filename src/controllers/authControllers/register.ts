import type { NextFunction, Request, Response } from "express";
import pg from "../../config/pg/pg.js";
import bcrypt from 'bcrypt';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, company } = req.body;

        const userExists = await pg.pool.query(`SELECT 1 from employers WHERE email = $1`, [email]);

        if (userExists.rows?.[0]) {
            return res.status(400).json({ message: 'Email already exists' });
        };

        const hash = await bcrypt.hash(password, 10);

        await pg.pool.query('BEGIN');

        const user = await pg.pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) returning id`,
            [name, email, hash]
        );


    } catch (error) {
        
        next(error);
    };
};

export default register;