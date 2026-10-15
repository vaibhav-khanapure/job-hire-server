import { randomBytes } from 'node:crypto';

const generateRandomCode = (len: number = 6): string => {
    return randomBytes(len).toString().slice(0, len).toUpperCase();
};

export default generateRandomCode;