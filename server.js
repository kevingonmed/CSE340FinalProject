import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import session from 'express-session';
import pg from 'connect-pg-simple';
import pgPkg from 'pg';
import 'dotenv/config';
import routes from './src/routes.js';
import { addLocalVariables } from './src/middleware/global.js';
import flash from './src/middleware/flash.js';
import { setupDatabase, testConnection } from './src/models/setup.js';

const { Pool } = pgPkg;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

const caCert = fs.readFileSync(path.join(__dirname, 'bin', 'byuicse-psql-cert.pem'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

const PgSession = pg(session);
const sessionPool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: { ca: caCert, rejectUnauthorized: true, checkServerIdentity: () => undefined }
});

app.use(session({
    store: new PgSession({
        pool: sessionPool,
        tableName: 'session',
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: NODE_ENV === 'production',
    },
}));

app.use(addLocalVariables);
app.use(flash);
app.use(routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500', {
        error: NODE_ENV === 'development' ? err.message : null
    });
});

app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`WanderDecide running on http://127.0.0.1:${PORT}`);
});