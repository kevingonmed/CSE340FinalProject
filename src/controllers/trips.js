import { validationResult } from 'express-validator';
import { createTripWithItinerary, getTripByIdForUser } from '../models/trips.js';
import { groupTypes, vibes } from '../middleware/validation/trips.js';
import { generateItinerary } from '../services/ai/index.js';

const MAX_TRIP_DAYS = 12;

const calculateTripDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const rawDays = Math.floor((end - start) / millisecondsPerDay) + 1;
    return Math.min(Math.max(rawDays, 1), MAX_TRIP_DAYS);
};

const showNewTripForm = (req, res) => {
    res.render('trips/new', {
        title: 'Plan a New Trip',
        errors: [],
        groupTypes,
        vibes,
        formData: {
            homeCity: '',
            budget: '',
            startDate: '',
            endDate: '',
            groupType: '',
            vibe: ''
        }
    });
};

const processNewTrip = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('trips/new', {
            title: 'Plan a New Trip',
            errors: errors.array(),
            groupTypes,
            vibes,
            formData: req.body
        });
    }

    try {
        const { homeCity, budget, startDate, endDate, groupType, vibe } = req.body;
        const travelDates = `${startDate} to ${endDate}`;
        const tripDays = calculateTripDays(startDate, endDate);
        const { itinerary, usedFallback } = await generateItinerary({
            homeCity,
            budget,
            travelDates,
            tripDays,
            groupType,
            vibe
        });

        const trip = await createTripWithItinerary({
            userId: req.session.user.id,
            homeCity,
            budget,
            travelDates,
            groupType,
            vibe,
            destination: itinerary.destination,
            whyPicked: itinerary.whyPicked,
            days: itinerary.days
        });

        if (usedFallback) {
            req.flash('warning', 'AI service was unavailable, so we generated a sample itinerary.');
        }
        if (tripDays === MAX_TRIP_DAYS) {
            req.flash('info', 'Trip plans are currently capped at 12 days to control API usage.');
        }
        req.flash('success', 'Trip generated and saved successfully.');
        return res.redirect(`/trips/${trip.id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'We could not generate your trip right now. Please try again.');
        return res.redirect('/trips/new');
    }
};

const showTrip = async (req, res) => {
    try {
        const tripId = Number.parseInt(req.params.id, 10);
        if (Number.isNaN(tripId)) {
            req.flash('error', 'Invalid trip ID.');
            return res.redirect('/dashboard');
        }

        const trip = await getTripByIdForUser(tripId, req.session.user.id);
        if (!trip) {
            req.flash('error', 'Trip not found.');
            return res.redirect('/dashboard');
        }

        return res.render('trips/show', {
            title: trip.destination,
            trip
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to load this trip right now.');
        return res.redirect('/dashboard');
    }
};

export { showNewTripForm, processNewTrip, showTrip };
