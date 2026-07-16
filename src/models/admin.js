import db from './db.js';

const getUsersWithRoles = async () => {
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.email, COALESCE(r.name, 'user') AS role_name, u.created_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY u.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

const getRecentTripsForAdmin = async () => {
    const query = `
        SELECT t.id, t.destination, t.travel_dates, t.budget, t.vibe, t.created_at, u.email AS owner_email
        FROM trips t
        INNER JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
        LIMIT 50
    `;
    const result = await db.query(query);
    return result.rows;
};

const getAdminStats = async () => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM trips) AS total_trips
    `;
    const result = await db.query(query);
    return result.rows[0];
};

export { getUsersWithRoles, getRecentTripsForAdmin, getAdminStats };
