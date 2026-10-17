import type { NextFunction, Request, Response } from 'express';
import redis from '../../config/redis.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generators/token/auth.js';
import { createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import getDeviceName from '../../utils/detectors/getDeviceName.js';
import pg from '../../config/pg.js';

interface User {
    id: number;

    n: string;
    p: string;
    cid: number;
    r: 'admin' | 'hr' | 'recruiter' | 'hiring_manager';

    // name: string;
    // password: string;
    // role: 'admin' | 'hr' | 'recruiter' | 'hiring_manager';
    // company_id: number;
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const userKey = `employer:${email}`;
        let user: User | null = null;

        const cachedUser = await redis.hGetAll(userKey);

        if (!cachedUser || !cachedUser['id'] || !cachedUser['p']) {
            const { rows: [userData] } = await pg.query(
                `SELECT e.id, e.name, e.password_hash, cr.role, cr.company_id
                 FROM employers e
                 INNER JOIN company_roles cr
                 ON e.id = cr.employer_id
                 WHERE e.email = $1
                 LIMIT 1
                `,
                [email]
            );

            if (!userData) {
                return res.status(401).json({ message: 'User not found' });
            };

            user = {
                id: userData?.id,
                n: userData?.name,
                p: userData?.password_hash,
                r: userData?.role,
                cid: userData?.company_id,
            };

            await redis.hSet(userKey, {
                id: String(user.id),
                cid: String(user.cid),
                n: user.n,
                p: user.p,
                r: user.r,
            });
        } else {
            user = {
                id: Number(cachedUser['id']),
                n: cachedUser['n'] ?? '',
                p: cachedUser['p'] ?? '',
                r: cachedUser['r'] as User['r'],
                cid: Number(cachedUser['cid']),
            };
        };

        const isPasswordCorrect = await bcrypt.compare(password, user?.p);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Email or password incorrect' });
        };

        const [accessToken, refreshToken] = await Promise.all([
            generateAccessToken({
                companyId: user?.cid,
                email,
                userId: user?.id,
                role: user?.r
            }),
            generateRefreshToken(user?.id)
        ]);

        const refreshTokenHash = createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        await pg.query(
            `INSERT INTO user_sessions 
             (user_id, refresh_token_hash, device_name, ip_address, user_agent, expires_at) 
             VALUES
             ($1, $2, $3, $4, $5, NOW() + INTERVAL '30 days')`,
            [user?.id, refreshTokenHash, getDeviceName(req?.get('user-agent')), req?.ip ?? null, req?.get('user-agent') ?? null]
        );

        return res.status(200).json({
            userId: user?.id,
            companyId: user?.cid,
            name: user?.n,
            role: user?.r,
            email,
            accessToken,
            refreshToken
        });
    } catch (error) {
        next(error);
    };
};

export default login;