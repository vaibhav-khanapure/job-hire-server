import z from 'zod';

const registerConfirmSchema = z.object({
    email: z
        .email({
            error: 'Email is required',
        })
        .trim()
        .toLowerCase(),

    code: z
        .string({
            error: 'Verification code is required',
        })
        .trim()
        .length(6, 'Verification code must be exactly 6 characters')
        .regex(/^[A-Za-z0-9]{6}$/, 'Invalid verification code'),
});

export default registerConfirmSchema;