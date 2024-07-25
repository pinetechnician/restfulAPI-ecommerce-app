const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'You are not authenticated.' });
};

module.exports = ensureAuthenticated;