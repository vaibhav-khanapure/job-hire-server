import express from 'express';
import compression from 'compression';
import morgan from 'morgan';

import ENV from '../constants/ENV.js';

import corsMiddleware from '../middlewares/corsMiddleware.js';
import helmetMiddleware from '../middlewares/helmetMiddleware.js';
import errorHandler from '../middlewares/errorHandler.js';
import rateLimiter from '../middlewares/rateLimiter.js';

const app = express();

// Caching
app.set('etag', true);

// Disable info
app.disable('x-powered-by');

// JSON parse middleware
app.use(express.json({ limit: '1mb' }));

// Trust proxy if behind a reverse proxy
app.set('trust proxy', true);

// Parse Form data in req.body
// app.use(express.urlencoded({ extended: true, limit: "1mb", }));

// CORS middleware
app.use(corsMiddleware());

// Compression
app.use(compression());

// Helmet Middleware
app.use(helmetMiddleware());

// Rate limit
app.use(rateLimiter());

// Add logging
if (ENV.IS_DEV) app.use(morgan("tiny"));

// Invalid API Routes
app.all("/*path", (_, res) => res.status(404).json({ message: "Invalid route" }));

// Error Handler
app.use(errorHandler);

export default app;