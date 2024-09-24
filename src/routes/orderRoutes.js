const express = require('express');
const orderController = require('../controllers/orderController');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, orderController.getOrders);
router.get('/:orderId', ensureAuthenticated, orderController.getOrderById);

module.exports = router;