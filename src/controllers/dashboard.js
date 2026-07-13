import { getTripsByUserId } from '../models/trips.js';

const showDashboard = async (req, res) => {
    try {
        const trips = await getTripsByUserId(req.session.user.id);
        return res.render('dashboard', {
            title: 'My Trips',
            user: req.session.user,
            trips
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to load your trips right now.');
        return res.render('dashboard', {
            title: 'My Trips',
            user: req.session.user,
            trips: []
        });
    }
};

export { showDashboard };