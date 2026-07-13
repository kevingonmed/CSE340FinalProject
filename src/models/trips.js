import db from './db.js';

const createTripWithItinerary = async ({
    userId,
    homeCity,
    budget,
    travelDates,
    groupType,
    vibe,
    destination,
    whyPicked,
    days
}) => {
    if (homeCity) {
        await db.query(
            'UPDATE users SET home_city = $1 WHERE id = $2',
            [homeCity, userId]
        );
    }

    const tripInsertQuery = `
        INSERT INTO trips (user_id, destination, budget, travel_dates, group_type, vibe, why_picked)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, user_id, destination, budget, travel_dates, group_type, vibe, why_picked, status, created_at
    `;

    const tripResult = await db.query(tripInsertQuery, [
        userId,
        destination,
        budget,
        travelDates,
        groupType,
        vibe,
        whyPicked
    ]);

    const trip = tripResult.rows[0];

    for (const day of days) {
        const dayInsertQuery = `
            INSERT INTO itinerary_days (trip_id, day_number, title)
            VALUES ($1, $2, $3)
            RETURNING id
        `;
        const dayResult = await db.query(dayInsertQuery, [trip.id, day.dayNumber, day.title]);
        const dayId = dayResult.rows[0].id;

        for (const activity of day.activities) {
            const activityInsertQuery = `
                INSERT INTO activities (day_id, time, description, estimated_cost)
                VALUES ($1, $2, $3, $4)
            `;
            await db.query(activityInsertQuery, [
                dayId,
                activity.time,
                activity.description,
                activity.estimatedCost
            ]);
        }
    }

    return trip;
};

const getTripsByUserId = async (userId) => {
    const query = `
        SELECT id, destination, budget, travel_dates, group_type, vibe, status, created_at
        FROM trips
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const getTripByIdForUser = async (tripId, userId) => {
    const tripQuery = `
        SELECT id, user_id, destination, budget, travel_dates, group_type, vibe, why_picked, status, created_at
        FROM trips
        WHERE id = $1 AND user_id = $2
    `;
    const tripResult = await db.query(tripQuery, [tripId, userId]);
    const trip = tripResult.rows[0];
    if (!trip) {
        return null;
    }

    const daysQuery = `
        SELECT id, day_number, title
        FROM itinerary_days
        WHERE trip_id = $1
        ORDER BY day_number ASC
    `;
    const daysResult = await db.query(daysQuery, [tripId]);

    const activitiesQuery = `
        SELECT a.id, a.day_id, a.time, a.description, a.estimated_cost
        FROM activities a
        INNER JOIN itinerary_days d ON a.day_id = d.id
        WHERE d.trip_id = $1
        ORDER BY d.day_number ASC, a.id ASC
    `;
    const activitiesResult = await db.query(activitiesQuery, [tripId]);

    const activitiesByDayId = new Map();
    for (const activity of activitiesResult.rows) {
        if (!activitiesByDayId.has(activity.day_id)) {
            activitiesByDayId.set(activity.day_id, []);
        }
        activitiesByDayId.get(activity.day_id).push({
            id: activity.id,
            time: activity.time,
            description: activity.description,
            estimatedCost: activity.estimated_cost
        });
    }

    const days = daysResult.rows.map((day) => ({
        id: day.id,
        dayNumber: day.day_number,
        title: day.title,
        activities: activitiesByDayId.get(day.id) || []
    }));

    return {
        ...trip,
        days
    };
};

export { createTripWithItinerary, getTripsByUserId, getTripByIdForUser };
