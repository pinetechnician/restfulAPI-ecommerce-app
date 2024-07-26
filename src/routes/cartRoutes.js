const express = require('express');
const cartController = require('../controllers/cartController');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.post('/', ensureAuthenticated, cartController.addItemToCart);

router.get('/', ensureAuthenticated, cartController.getCart);

router.delete('/items/:itemId', ensureAuthenticated, cartController.removeItemFromCart);

router.post('/:cartId/checkout', ensureAuthenticated, cartController.checkout);

module.exports = router;