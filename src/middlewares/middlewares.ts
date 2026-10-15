// App Middlewares
import corsMiddleware from './app/corsMiddleware.js';
import errorHandler from './app/errorHandler.js';
import helmetMiddleware from './app/helmetMiddleware.js';
import rateLimiter from './app/rateLimiter.js';

// Validator Middlewares
import schemaValidator from './validators/schemaValidator.js';

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
        schemaValidator
    },
};

export default middlewares;