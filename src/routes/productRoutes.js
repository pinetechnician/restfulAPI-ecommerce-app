const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products, optionally filter by category
router.get('/', productController.getProducts);

// Get a single product by search matching either ID or description
router.get('/search', productController.searchProducts);

// Get a single product by ID
router.get('/:productId', productController.getProductById);



module.exports = router;