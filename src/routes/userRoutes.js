const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/users/profile',
    failureRedirect: '/login-failure'
}));

router.get('/login-success', (req, res) => {
    res.send('You have successfully logged in.');
});

router.get('/login-failure', (req, res) => {
    res.send('Login failed.');
});

router.get('/profile', (req, res) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    if (req.isAuthenticated()) {
        res.send(`Hello ${req.user.username}`);
    } else {
        res.send('You are not authenticated.');
    }
});

router.get('/:userId', ensureAuthenticated, userController.getUserById);

router.put('/:userId', ensureAuthenticated, userController.updateUserById);

module.exports = router;