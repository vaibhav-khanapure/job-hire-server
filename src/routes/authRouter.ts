import { Router } from 'express';

const authRouter = Router();

authRouter.post('/register');

authRouter.post('/register-confirm');

authRouter.post('/login');

authRouter.post('/forgot-password');

authRouter.put('/reset-password');

authRouter.post('/resend-code');

authRouter.delete('/logout');

authRouter.get('/verify-auth');

authRouter.post('/google-auth');