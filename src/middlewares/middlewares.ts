import corsMiddleware from './app/corsMiddleware.js';
import errorHandler from './app/errorHandler.js';
import helmetMiddleware from './app/helmetMiddleware.js';
import rateLimiter from './app/rateLimiter.js';

const middlewares = {
    app: {
        corsMiddleware,
        errorHandler,
        helmetMiddleware,
        rateLimiter
    }
};

export default middlewares;