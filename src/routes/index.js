const express = require('express');
const userRoutes = require('./userRoutes');
//const productRoutes = require('./productRoutes');

const router = express.Router();

router.use('/users', userRoutes);
//router.use('/products', productRoutes);

module.exports = router;
