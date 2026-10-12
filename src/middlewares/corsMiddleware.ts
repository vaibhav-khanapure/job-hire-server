import cors from 'cors';
import ENV from '../constants/ENV.js';

const corsMiddleware = () => {
    return cors({
        // Allowed origin(s).
        origin: ENV.CLIENT_URL,

        // Allow cookies/auth headers.
        credentials: true,

        // Allowed HTTP methods.
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

        // Allowed request headers.
        allowedHeaders: ["Content-Type", "Authorization"],

        // Response headers accessible to frontend.
        exposedHeaders: ["X-Request-Id"],

        // Cache preflight response (seconds).
        maxAge: 86400,

        // Continue OPTIONS request to next middleware.
        preflightContinue: false,

        // Success status for preflight requests.
        optionsSuccessStatus: 204,
    });
};

export default corsMiddleware;