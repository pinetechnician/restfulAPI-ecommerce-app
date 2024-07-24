const pool = require('../config/database');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json(results.rows[0].id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
};