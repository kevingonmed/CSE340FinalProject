-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
INSERT INTO roles (name) VALUES ('user') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    home_city VARCHAR(100),
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backfill role_id for any users without a role
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'user')
WHERE role_id IS NULL;

-- Trips
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255) NOT NULL,
    budget NUMERIC(10,2),
    travel_dates VARCHAR(100),
    group_type VARCHAR(50),
    vibe VARCHAR(50),
    why_picked TEXT,
    status VARCHAR(20) DEFAULT 'saved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itinerary Days
CREATE TABLE IF NOT EXISTS itinerary_days (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(255)
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    day_id INTEGER REFERENCES itinerary_days(id) ON DELETE CASCADE,
    time VARCHAR(50),
    description TEXT NOT NULL,
    estimated_cost NUMERIC(10,2)
);