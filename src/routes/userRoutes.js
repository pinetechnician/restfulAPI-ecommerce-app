const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // On success, return the user data as JSON
            return res.json({ message: 'Login successful', user: { username: user.username, email: user.email } });
        });
    })(req, res, next);
});
/*router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/users/profile',
    failureRedirect: '/login-failure'
}));*/

router.get('/login-failure', (req, res) => {
    res.send('Login failed.');
});

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        // Return user data as JSON
        res.json({
            username: req.user.username,
            email: req.user.email,
        });
    } else {
        res.status(401).json({ error: 'You are not authenticated' });
    }
});
/*router.get('/profile', (req, res) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    if (req.isAuthenticated()) {
        res.send(`Hello ${req.user.username}`);
    } else {
        res.send('You are not authenticated.');
    }
});*/

router.get('/:userId', ensureAuthenticated, userController.getUserById);

router.put('/:userId', ensureAuthenticated, userController.updateUserById);

module.exports = router;