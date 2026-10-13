import pg from '../config/pg/pg.js';
import { readFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

const migrate = async () => {
    const migrationsDir = join(
        process.cwd(),
        'src',
        'db',
        'migrations',
    );

    const client = await pg.pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        const pathArg = process.argv
            .slice(2)
            .find(arg => arg.startsWith('--path='));

        let files;

        if (pathArg) {
            files = pathArg
                .slice('--path='.length)
                .split(',')
                .map(path => path.trim())
                .filter(Boolean);
        } else {
            files = await readdir(migrationsDir);
            files = files.filter(file => file.endsWith('.sql'));
        };

        for (const file of files) {
            if (basename(file) !== file || !file.endsWith('.sql')) {
                throw new Error(`Invalid migration filename: ${file}`);
            };
        };

        files.sort();

        for (const file of files) {
            const { rows } = await client.query(
                `SELECT 1 FROM schema_migrations WHERE name = $1`,
                [file],
            );

            if (rows.length > 0) {
                console.log(`Skipping already applied migration: ${file}`);
                continue;
            };

            const sql = await readFile(join(migrationsDir, file), 'utf8',);

            console.log(`Running migration: ${file}`);

            await client.query('BEGIN');

            try {
                await client.query(sql);

                await client.query(
                    `INSERT INTO schema_migrations (name) VALUES ($1)`,
                    [file],
                );

                await client.query('COMMIT');

                console.log(`Migration completed: ${file}`);
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            };
        };

        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        client.release();
    };
};

migrate().catch(() => {
    process.exitCode = 1;
});