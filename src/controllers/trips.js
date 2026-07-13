import { validationResult } from 'express-validator';
import { createTripWithItinerary, getTripByIdForUser } from '../models/trips.js';
import { groupTypes, vibes } from '../middleware/validation/trips.js';

const buildMockItinerary = ({ homeCity, budget, travelDates, groupType, vibe }) => {
    const destinationByVibe = {
        adventure: 'Moab, Utah',
        relax: 'Carmel-by-the-Sea, California',
        culture: 'Santa Fe, New Mexico',
        food: 'Portland, Oregon',
        nature: 'Jackson, Wyoming'
    };

    const destination = destinationByVibe[vibe] || 'Denver, Colorado';
    const budgetLevel = Number(budget) < 700 ? 'budget-friendly' : Number(budget) > 1800 ? 'premium' : 'balanced';
    const groupLabel = groupType.charAt(0).toUpperCase() + groupType.slice(1);

    return {
        destination,
        whyPicked: `${destination} matches your ${vibe} vibe, ${budgetLevel} budget range, and ${groupLabel.toLowerCase()} travel style from ${homeCity}.`,
        days: [
            {
                dayNumber: 1,
                title: 'Arrival and Local Highlights',
                activities: [
                    { time: '9:00 AM', description: `Arrive from ${homeCity} and check in`, estimatedCost: 0 },
                    { time: '11:00 AM', description: `Explore downtown ${destination}`, estimatedCost: 20 },
                    { time: '6:00 PM', description: 'Welcome dinner at a top-rated local spot', estimatedCost: 45 }
                ]
            },
            {
                dayNumber: 2,
                title: `${groupLabel} ${vibe} Experience`,
                activities: [
                    { time: '8:30 AM', description: `Main ${vibe} activity block`, estimatedCost: 65 },
                    { time: '1:30 PM', description: 'Lunch and neighborhood walk', estimatedCost: 25 },
                    { time: '4:00 PM', description: 'Free-time recommendations and photo spots', estimatedCost: 0 }
                ]
            },
            {
                dayNumber: 3,
                title: 'Wrap-Up and Return',
                activities: [
                    { time: '9:30 AM', description: 'Relaxed morning and souvenir stop', estimatedCost: 30 },
                    { time: '12:00 PM', description: `Check out and return travel (${travelDates})`, estimatedCost: 0 }
                ]
            }
        ]
    };
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
            travelDates: '',
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
        const { homeCity, budget, travelDates, groupType, vibe } = req.body;
        const itinerary = buildMockItinerary({ homeCity, budget, travelDates, groupType, vibe });

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
