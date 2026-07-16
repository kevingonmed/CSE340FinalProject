import db from '../db.js';

const createUser = async ({ firstName, lastName, email, password }) => {
    const query = `
        INSERT INTO users (first_name, last_name, email, password, role_id)
        VALUES ($1, $2, $3, $4, (SELECT id FROM roles WHERE name = 'user'))
        RETURNING id, first_name, last_name, email
    `;
    const result = await db.query(query, [firstName, lastName, email, password]);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.*, r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

export { createUser, findUserByEmail };