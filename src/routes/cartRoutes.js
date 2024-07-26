const express = require('express');
const cartController = require('../controllers/cartController');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.post('/cart', ensureAuthenticated, cartController.addItemToCart);

router.get('/cart', ensureAuthenticated, cartController.getCart);

router.delete('/cart/items/:itemId', ensureAuthenticated, cartController.removeItemFromCart);

module.exports = router;