const addLocalVariables = (req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
    res.locals.isLoggedIn = !!(req.session && req.session.user);
    res.locals.user = req.session?.user || null;
    next();
};

export { addLocalVariables };