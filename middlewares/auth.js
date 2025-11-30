/**
 * Middleware to check if user is logged in (either student or faculty)
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user && !req.session.faculty) {
        return res.redirect("/?error=Please login to continue");
    }
    next();
};

/**
 * Middleware to check if logged in user is a student
 */
module.exports.isStudent = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/?error=Student access only");
    }
    next();
};

/**
 * Middleware to check if logged in user is faculty
 */
module.exports.isFaculty = (req, res, next) => {
    if (!req.session.faculty) {
        return res.redirect("/?error=Faculty access only");
    }
    next();
};

/**
 * Middleware to set local variables for views
 */
module.exports.setLocals = (req, res, next) => {
    res.locals.student = req.session.user || null;
    res.locals.faculty = req.session.faculty || null;
    res.locals.currentUser = req.session.user || req.session.faculty || null;
    next();
};
