import { z } from 'zod';

const envSchema = z.object({
    APP_PORT: z.coerce.number().int().min(1).max(65535),

    CLIENT_URL: z.url(),

    IS_DEV: z.boolean(),
    IS_PROD: z.boolean(),

    JWT_ACCESS_SECRET: z.string().min(20),
    JWT_REFRESH_SECRET: z.string().min(20),

    NODE_ENV: z.enum(['development', 'production']),

    POSTGRES_URL: z.url(),
    REDIS_URL: z.url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(`Invalid environment variables: \x1b[36mPATH\x1b[0m=src/constants/ENV.ts`);
    console.error(z.prettifyError(parsedEnv.error));
    process.exit(1);
};

const ENV = {
    ...parsedEnv.data,

    IS_DEV: parsedEnv.data.NODE_ENV === 'development',
    IS_PROD: parsedEnv.data.NODE_ENV === 'production',
};

export default ENV;