import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const setupDatabase = async () => {
    let hasData = false;
    try {
        const result = await db.query("SELECT EXISTS (SELECT 1 FROM users LIMIT 1) as has_data");
        hasData = result.rows[0]?.has_data || false;
    } catch (error) {
        hasData = false;
    }

    if (hasData) {
        console.log('Database already set up');
        return true;
    }

    console.log('Setting up database...');
    const sqlPath = join(__dirname, 'sql', 'setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await db.query(sql);
    console.log('Database setup complete');
    return true;
};

const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connected:', result.rows[0].current_time);
    return true;
};

export { setupDatabase, testConnection };