import type { NextFunction, Request, Response } from 'express';
import pg from '../../config/pg/pg.js';
import redis from '../../config/redis.js';
import bcrypt from 'bcrypt';
import generateRandomCode from '../../utils/generators/generateRandomCode.js';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, company } = req.body;

        const { rows: [existingUser] } = await pg.pool.query(`SELECT 1 from employers WHERE email = $1`, [email]);

        if (existingUser) {
            return res.status(409).json({ message: 'Email already taken' });
        };

        const code = generateRandomCode(6);
        const hash = await bcrypt.hash(password, 10);

        const isSet = await redis.set(
            `auth:register:${email}`,
            JSON.stringify({
                name,
                email,
                hash,
                code,
                company
            }),
            {
                condition: 'NX',
                expiration: {
                    type: 'EX',
                    value: 300
                }
            });

        if (!isSet) {
            return res.status(409).json({
                message: 'Registration already in progress. Please try again later'
            });
        };

        return res.sendStatus(200);
    } catch (error) {
        next(error);
    };
};

export default register;