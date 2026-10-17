import type { NextFunction, Request, Response } from 'express';
import type { PoolClient } from 'pg';
import { createHash } from 'node:crypto';
import redis from '../../config/redis.js';
import generateCompanySlug from '../../utils/generators/generateCompanySlug.js';
import getDeviceName from '../../utils/detectors/getDeviceName.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generators/token/auth.js';
import pg from '../../config/pg.js';

interface UserData {
    name: string;
    email: string;
    company: string;
    hash: string;
    code: string;
};

const MAX_ATTEMPTS = 5;

const registerConfirm = async (req: Request, res: Response, next: NextFunction) => {
    let poolClient: PoolClient | null = null;
    let isTransactionCommitted = false;

    const { email, code } = req.body;

    const userKey = `employer:auth:register:${email}`;
    const userAttemptsKey = `${userKey}:attempts`;

    try {
        const [userRedisData, userAttempts] = await Promise.all([
            redis.get(userKey),
            redis.get(userAttemptsKey)
        ]);

        if (!userRedisData || !userAttempts) {
            return res.status(404).json({ message: 'Registration session expired' });
        };

        if (Number(userAttempts) >= MAX_ATTEMPTS) {
            await redis.del([userKey, userAttemptsKey]);
            return res.status(400).json({ message: `Max code attempts reached` });
        };

        const userData = JSON.parse(userRedisData) as UserData;

        if (code !== userData?.code) {
            const codeAttempts = await redis.incr(userAttemptsKey);

            if (codeAttempts >= MAX_ATTEMPTS) {
                await redis.del([userKey, userAttemptsKey]);

                return res.status(400).json({
                    message: 'Max code attempts reached'
                });
            };

            return res.status(400).json({
                message: `Incorrect code, ${MAX_ATTEMPTS - codeAttempts} attempts remaining`
            });
        };

        poolClient = await pg.connect();

        await poolClient.query('BEGIN');

        const { rows: [user] } = await poolClient.query(
            `INSERT INTO employers (name, email, password_hash) VALUES ($1, $2, $3) returning id`,
            [userData?.name, email, userData?.hash]
        );

        const { rows: [company] } = await poolClient.query(
            `INSERT INTO companies (name, slug, created_by) VALUES ($1, $2, $3) returning id`,
            [userData?.company, generateCompanySlug(userData?.company), user?.id]
        );

        await poolClient.query(
            `INSERT INTO company_roles (company_id, employer_id, role) VALUES ($1, $2, $3)`,
            [company?.id, user?.id, 'admin']
        );

        const [accessToken, refreshToken] = await Promise.all([
            generateAccessToken({
                companyId: company?.id,
                email,
                userId: user?.id,
                role: 'admin'
            }),
            generateRefreshToken(user?.id)
        ]);

        const refreshTokenHash = createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        await poolClient.query(
            `INSERT INTO user_sessions 
             (user_id, refresh_token_hash, device_name, ip_address, user_agent, expires_at) 
             VALUES
             ($1, $2, $3, $4, $5, NOW() + INTERVAL '30 days')`,
            [user?.id, refreshTokenHash, getDeviceName(req?.get('user-agent')), req?.ip ?? null, req?.get('user-agent') ?? null]
        );

        await poolClient.query('COMMIT');
        isTransactionCommitted = true;

        try {
            await redis.del([userKey, userAttemptsKey]);
        } catch (error) {
            console.error(`REDIS ERROR: Register confirm delete failed for ${email} - Reason:`, error);
        };

        try {
            await redis.hSet(`employer:${email}`, {
                id: String(user.id),
                cid: String(user.cid),
                n: userData.name,
                p: userData?.hash,
                r: 'admin',
            });
        } catch (error) {
            console.error(`REDIS ERROR: User store at register confirm failed for ${email} - Reason:`, error);
        };

        return res.status(201).json({
            userId: user?.id,
            companyId: company?.id,
            email,
            accessToken,
            refreshToken
        });
    } catch (error) {
        if (poolClient && !isTransactionCommitted) {
            try {
                await poolClient.query('ROLLBACK');
            } catch (error) {
                console.error(`REDIS ERROR: Register confirm delete key failed for ${email} - Reason:`, error);
            };
        };

        next(error);
    } finally {
        if (poolClient) {
            poolClient.release();
        };
    };
};

export default registerConfirm;