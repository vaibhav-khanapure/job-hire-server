import type { Server } from 'node:http';

import redis from '../config/redis.js';
import pg from '../config/pg/pg.js';

let isShuttingDown = false;

const shutdownServer = async (server: Server, signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n${signal} received. Starting graceful shutdown...`);

    const timeout = setTimeout(() => {
        console.error('Graceful shutdown timed out. Forcing exit...');
        process.exit(1);
    }, 10_000);

    try {
        // Stop accepting new HTTP connections.
        await new Promise<void>((resolve, reject) => {
            server.close((err) => {
                if (err) return reject(err);
                resolve();
            });

            // Close idle keep-alive connections where supported.
            server.closeIdleConnections?.();
        });

        // Close external resources.
        const results = await Promise.allSettled([
            redis.isOpen ? redis.quit() : Promise.resolve(),
            pg.pool.end(),
        ]);

        const failures = results.filter((result) => result.status === 'rejected');

        if (failures.length) {
            console.error('Some resources failed to close:', failures);
        };

        clearTimeout(timeout);

        console.log(failures.length ? 'Shutdown completed with errors' : 'Shutdown complete');

        process.exit(failures.length ? 1 : 0);
    } catch (err) {
        clearTimeout(timeout);
        console.error('Shutdown failed:', err);
        process.exit(1);
    };
};

export default shutdownServer;