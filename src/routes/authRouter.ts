import { Router } from 'express';
import schemaValidator from '../middlewares/validators/schemaValidator.js';
import controllers from '../controllers/controllers.js';
import validationSchemas from '../validationSchemas/validationSchemas.js';

const authRouter = Router();

authRouter.post(
    '/register',
    schemaValidator(validationSchemas.auth.register),
    controllers.auth.register
);

authRouter.post(
    '/register-confirm',
    schemaValidator(validationSchemas.auth.registerConfirm),
    controllers.auth.registerConfirm
);

authRouter.post(
    '/login'
);

authRouter.post('/forgot-password');

authRouter.put('/reset-password');

authRouter.post('/resend-code');

authRouter.delete('/logout');

authRouter.get('/verify-auth');

authRouter.post('/google-auth');