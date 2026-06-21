const showDashboard = (req, res) => {
    res.render('dashboard', {
        title: 'My Trips',
        user: req.session.user,
        trips: []
    });
};

export { showDashboard };