/**
 * Flash Message Middleware
 * Stores temporary messages in the session that survive redirects,
 * display once, then are automatically cleared.
 */
const flashMiddleware = (req, res, next) => {
    let sessionNeedsSave = false;

    const originalRedirect = res.redirect.bind(res);
    res.redirect = (...args) => {
        if (sessionNeedsSave && req.session) {
            req.session.save(() => {
                originalRedirect.apply(res, args);
            });
        } else {
            originalRedirect.apply(res, args);
        }
    };

    req.flash = function (type, message) {
        if (!req.session) {
            if (type && message) return;
            return { success: [], error: [], warning: [], info: [] };
        }

        if (!req.session.flash) {
            req.session.flash = { success: [], error: [], warning: [], info: [] };
        }

        // SETTING: two args = store a message
        if (type && message) {
            if (!req.session.flash[type]) req.session.flash[type] = [];
            req.session.flash[type].push(message);
            sessionNeedsSave = true;
            return;
        }

        // GETTING ONE TYPE: one arg = retrieve and clear that type
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // GETTING ALL: no args = retrieve and clear everything
        const allMessages = req.session.flash || { success: [], error: [], warning: [], info: [] };
        req.session.flash = { success: [], error: [], warning: [], info: [] };
        return allMessages;
    };

    next();
};

const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash.bind(req);
    next();
};

const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;