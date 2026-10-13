import express from 'express';
import compression from 'compression';
import morgan from 'morgan';

import ENV from '../constants/ENV.js';
import middlewares from '../middlewares/middlewares.js';
import API from '../routes/API.js';

const app = express();

// Caching
app.set('etag', true);

// Disable Info
app.disable('x-powered-by');

// JSON Parse Middleware
app.use(express.json({ limit: '1mb' }));

// Trust proxy if behind a reverse proxy
app.set('trust proxy', true);

// Parse Form data in req.body
// app.use(express.urlencoded({ extended: true, limit: "1mb", }));

// CORS Middleware
app.use(middlewares.app.corsMiddleware());

// Compression
app.use(compression());

// Helmet Middleware
app.use(middlewares.app.helmetMiddleware());

// Rate Limit
app.use(middlewares.app.rateLimiter());

// Add Logging
if (ENV.IS_DEV) app.use(morgan("tiny"));

// API Routes
app.use('/api/v1', API);

// Invalid API Routes
app.all('/*path', (_, res) => res.status(404).json({ message: 'Invalid route' }));

// Error Handler
app.use(middlewares.app.errorHandler());

export default app;