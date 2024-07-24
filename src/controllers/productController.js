const pool = require('../config/database'); // assuming you have a db.js file that sets up your pg Pool

// Get all products, optionally filter by category
const getProducts = (req, res) => {
  const categoryId = req.query.category;
  let query = 'SELECT * FROM products';
  const params = [];

  if (categoryId) {
    query += ' WHERE category_id = $1';
    params.push(categoryId);
  }

  pool.query(query, params, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

// Get a single product by ID
const getProductById = (req, res) => {
  const productId = parseInt(req.params.productId);

  pool.query('SELECT * FROM products WHERE id = $1', [productId], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getProducts,
  getProductById,
};
