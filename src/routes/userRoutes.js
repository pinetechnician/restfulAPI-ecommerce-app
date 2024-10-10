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
            return res.json({ message: 'Login successful', user: { username: user.username, email: user.email, userId: user.id } });
        });
    })(req, res, next);
});

router.get('/login-failure', (req, res) => {
    res.send('Login failed.');
});

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        // Return user data as JSON
        res.json({
            username: req.user.username,
            email: req.user.email,
            userId: req.user.id,
            storeName: req.user.store_name,
            firstName: req.user.first_name,
            lastName: req.user.last_name,
            phoneNumber: req.user.phone_number,
            address: req.user.address,
            city: req.user.city,
            zipcode: req.user.zipcode,
            country: req.user.country,
            state: req.user.state,
        });
    } else {
        res.status(401).json({ error: 'You are not authenticated' });
    }
});

router.get('/:userId', ensureAuthenticated, userController.getUserById);

router.put('/:userId', ensureAuthenticated, userController.updateUserById);

router.get('/session', ensureAuthenticated, (req, res) =>{
    if (req.session.user) {
        res.json({ isAuthenticate: true, user: req.session.user })
    } else { 
        res.json({ isAuthenticated: false })
    }
});

router.post('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
      // Destroy the session after logout
      req.logout(function(err) {
        if (err) { return next(err); }
        
        // Destroy the session
        req.session.destroy(function(err) {
          if (err) return next(err);
          
          // Clear the session cookie
          res.clearCookie('connect.sid');
          res.status(200).send({ message: 'Logged out successfully' });
        });
      });
    } else {
      res.status(400).send({ message: 'No active session' });
    }
});

module.exports = router;