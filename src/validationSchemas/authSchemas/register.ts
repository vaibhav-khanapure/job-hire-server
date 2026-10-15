import z from 'zod';

const registerSchema = z.object({
    name: z
        .string({
            error: 'Name is required',
        })
        .trim()
        .min(3, 'Name should be at least 3 characters')
        .max(100, 'Name is too long')
        .regex(/^[A-Za-z\s'-]+$/, 'Name contains invalid characters'),

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
        .max(128, 'Password is too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

    company: z
        .string({
            error: 'Company name is required',
        })
        .trim()
        .min(1)
        .max(300, 'Name is too long')
        .regex(/^[A-Za-z\s'-]+$/, 'Company name contains invalid characters'),
});

export default registerSchema;