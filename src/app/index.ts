import 'dotenv/config';

import ENV from '../constants/ENV.js';
import pg from '../config/pg.js';
import redis from '../config/redis.js';
import app from './app.js';
import shutdownServer from '../lib/shutdownServer.js';

const startServer = async () => {
    try {
        console.log('Connecting to Redis');
        await redis.connect();
        console.log('Connected to Redis');

        console.log('Checking PostgreSQL connection');
        await pg.query('SELECT 1');
        console.log('PostgreSQL connection successful');

        const server = app.listen(ENV.APP_PORT);

        await new Promise<void>((resolve, reject) => {
            server.once('listening', resolve);
            server.once('error', reject);
        });

        console.log(`Server listening on port ${ENV.APP_PORT}`);

        // Graceful shutdown signals
        process.on('SIGTERM', () => {
            void shutdownServer(server, 'SIGTERM');
        });

        process.on('SIGINT', () => {
            void shutdownServer(server, 'SIGINT');
        });

        // PM2 graceful reload/restart signal, if configured.
        process.on('SIGUSR2', () => {
            void shutdownServer(server, 'SIGUSR2');
        });

        process.on('uncaughtException', (err) => {
            console.error('Uncaught exception:', err);
            void shutdownServer(server, 'uncaughtException');
        });

        process.on('unhandledRejection', (reason) => {
            console.error('Unhandled promise rejection:', reason);
            void shutdownServer(server, 'unhandledRejection');
        });
    } catch (error) {
        console.error('Failed to start application:', error);

        await Promise.allSettled([
            redis.isOpen ? redis.quit() : Promise.resolve(),
            pg.end(),
        ]);

        process.exit(1);
    }
};

void startServer();