import { SignJWT } from 'jose';
import ENV from '../../../constants/ENV.js';

interface Payload {
    userId: number;
    email: string;
    companyId: number;
    role: 'admin' | 'hr' | 'recruiter' | 'hiring_manager';
};

// TextEncoder converts your secret string into a Uint8Array, which jose uses as the signing key.
const accessSecret = new TextEncoder().encode(ENV.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(ENV.JWT_REFRESH_SECRET);

const generateAccessToken = async (payload: Payload) => {
    const token = await new SignJWT({ ...payload, })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(String(payload?.userId))
        .setIssuedAt()
        .setExpirationTime("10m")
        .sign(accessSecret);

    return token;
};

const generateRefreshToken = async (userId: number) => {
    const token = await new SignJWT({
        type: "refresh",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(String(userId))
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(refreshSecret);

    return token;
};

export { generateAccessToken, generateRefreshToken };