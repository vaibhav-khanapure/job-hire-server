import type { NextFunction, Request, Response } from 'express';
import pg from '../../config/pg/pg.js';
import bcrypt from 'bcrypt';
import redis from '../../config/redis.js';
import generateRandomCode from '../../utils/generators/generateRandomCode.js';

const REDIS_REGISTER_SCRIPT = `
    if redis.call('EXISTS', KEYS[1]) == 1
      or redis.call('EXISTS', KEYS[2]) == 1
      then return 0
    end

    redis.call('SET', KEYS[1], ARGV[1], 'EX', 300)
    redis.call('SET', KEYS[2], ARGV[2], 'EX', 300)

    return 1
`;

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, company, password } = req.body;

        const { rows: [userExists] } = await pg.pool.query(
            `SELECT 1 FROM employers WHERE email = $1`,
            [email]
        );

        if (userExists) {
            return res.status(409).json({ message: 'Email already taken' });
        };

        const hash = await bcrypt.hash(password, 10);

        const userKey = `auth:register:${email}`;
        const userAttemptsKey = `${userKey}:attempts`;

        const code = generateRandomCode();

        const acknowledged = await redis.eval(REDIS_REGISTER_SCRIPT, {
            keys: [userKey, userAttemptsKey],
            arguments: [
                JSON.stringify({ name, email, company, hash, code }),
                '0'
            ]
        });

        if (Number(acknowledged) !== 1) {
            return res.status(409).json({
                message: 'Registration already in progress'
            });
        };

        return res.sendStatus(202);
    } catch (error) {
        next(error);
    };
};

export default register;