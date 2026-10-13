import { Pool } from 'pg';
import ENV from '../../constants/ENV.js';

const pool = new Pool({
    connectionString: ENV.POSTGRES_URL,
    max: 10
});

pool.on('connect', () => {
    console.log('Pool Postgres Connected successfully');
});

pool.on('acquire', () => {
    console.log('Pool Postgres client acquired');
});

pool.on("remove", (_client) => {
    console.log('Pool Client removed from pool');
});

pool.on("error", (err) => {
    console.error('Unexpected pool PostgreSQL error:', err);
});

export default pool;