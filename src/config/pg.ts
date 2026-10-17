import { Pool } from 'pg';
import ENV from '../constants/ENV.js';

const pg = new Pool({
    connectionString: ENV.POSTGRES_URL,
    max: 10
});

pg.on('connect', () => {
    console.log('Pool Postgres Connected successfully');
});

pg.on('acquire', () => {
    console.log('Pool Postgres client acquired');
});

pg.on("remove", (_client) => {
    console.log('Pool Client removed from pool');
});

pg.on("error", (err) => {
    console.error('Unexpected pool PostgreSQL error:', err);
});

export default pg;