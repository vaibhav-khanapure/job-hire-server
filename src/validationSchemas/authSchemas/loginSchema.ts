import z from "zod";

const loginSchema = z.object({
    email: z
        .email({
            error: 'Email is required',
        })
        .trim()
        .toLowerCase(),

    password: z
        .string({
            error: 'Password is required',
        })
        .min(8, 'Password must be at least 8 characters')
        .max(30, 'Password is too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export default loginSchema;