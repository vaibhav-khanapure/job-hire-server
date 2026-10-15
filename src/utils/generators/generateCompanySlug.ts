import { randomBytes } from 'node:crypto';

const generateCompanySlug = (companyName: string): string => {
    const name = companyName
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const suffix = randomBytes(5).toString('hex');

    return `${name}-${suffix}`;
};

export default generateCompanySlug;