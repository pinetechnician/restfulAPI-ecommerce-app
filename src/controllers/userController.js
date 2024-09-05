const pool = require('../config/database');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Define validation schema using Joi
const registerSchema = Joi.object({
    username: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9_-]+$/)
        .min(3)
        .max(30)
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required() // Enforce password length or complexity
});

const register = async (req, res) => {
    // Validate the input against the schema
    const { error } = registerSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        console.log(result);
        res.status(201).json(`User registered, ID: ${result.rows[0].id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = (req, res) => {
    // Validate the input against the schema
    const { error } = registerSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const userId = parseInt(req.params.userId);
  
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
  
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
  
    pool.query('SELECT * FROM users WHERE id = $1', [userId], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows[0]);
    });
  };

const updateUserById = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { username, email, password } = req.body;

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    if (req.user.id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
    }

    let updateFields = [];
    let updateValues = [];

    if (username) {
        updateFields.push('username = $' + (updateFields.length + 1));
        updateValues.push(username);
    }

    if (email) {
        updateFields.push('email = $' + (updateFields.length + 1));
        updateValues.push(email);
    }

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push('password = $' + (updateFields.length + 1));
        updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update.' });
    }

    updateValues.push(userId);
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${updateValues.length} RETURNING *`;

    pool.query(query, updateValues, (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows[0]);
    });

};

module.exports = {
    register,
    getUserById,
    updateUserById,
};