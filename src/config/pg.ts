import { Pool } from 'pg';
import ENV from '../constants/ENV.js';

const pg = new Pool({
    connectionString: ENV.POSTGRES_URL,
    max: 10
});

pg.on('connect', () => {
    console.log('Postgres Connected successfully');
});

pg.on('acquire', () => {
    console.log('Postgres client acquired');
});

pg.on("remove", (_client) => {
    console.log("Client removed from pool");
});

pg.on("error", (err) => {
    console.error("Unexpected PostgreSQL error:", err);
});

export default pg;