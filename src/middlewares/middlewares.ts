// App Middlewares
import corsMiddleware from './app/corsMiddleware.js';
import errorHandler from './app/errorHandler.js';
import helmetMiddleware from './app/helmetMiddleware.js';
import rateLimiter from './app/rateLimiter.js';

// Validator Middlewares
import schemaValidatorMiddleware from './validators/schemaValidatorMiddleware.js';

const middlewares = {
    app: {
        corsMiddleware,
        errorHandler,
        helmetMiddleware,
        rateLimiter
    },
    auth: {

    },
    validators: {
        schemaValidatorMiddleware
    },
};

export default middlewares;