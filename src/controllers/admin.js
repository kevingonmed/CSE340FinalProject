import { getUsersWithRoles, getRecentTripsForAdmin, getAdminStats } from '../models/admin.js';

const showAdminDashboard = async (req, res) => {
    try {
        const [users, trips, stats] = await Promise.all([
            getUsersWithRoles(),
            getRecentTripsForAdmin(),
            getAdminStats()
        ]);

        return res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            users,
            trips,
            stats
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Unable to load admin dashboard right now.');
        return res.redirect('/dashboard');
    }
};

export { showAdminDashboard };
