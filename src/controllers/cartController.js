const pool = require('../config/database');

const addItemToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        // Check if the user already has a cart
        let cartResult = await pool.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [userId]
        );

        let cartId;
        if (cartResult.rows.length === 0) {
            // If no cart exists, create a new cart
            cartResult = await pool.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
                [userId]
            );
        }

        cartId = cartResult.rows[0].id;

        // Add the item to the cart
        const result = await pool.query(
            'INSERT INTO cartitems (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [cartId, productId, quantity]
        );
        console.log(result);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get the user's cart
const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        // Perform a single query to get the cart and its items with product details
        const result = await pool.query(
            `SELECT carts.id as cart_id, cartitems.id as item_id, cartitems.product_id, cartitems.quantity,
                    products.name as product_name, products.description as product_description, products.price as product_price
             FROM carts
             LEFT JOIN cartitems ON carts.id = cartitems.cart_id
             LEFT JOIN products ON cartitems.product_id = products.id
             WHERE carts.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0 || result.rows[0].cart_id === null) {
            // If no cart or items exist, return a response indicating an empty cart
            return res.status(200).json({ message: 'Your cart is empty.' });
        }

        const cartItems = result.rows.map(row => ({
            itemId: row.item_id,
            productId: row.product_id,
            productName: row.product_name,
            productDescription: row.product_description,
            productPrice: row.product_price,
            quantity: row.quantity
        }));

        const cartData = {
            cartId: result.rows[0].cart_id,
            items: cartItems
        };

        res.status(200).json(cartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove an item from the cart
const removeItemFromCart = async (req, res) => {
    const userId = req.user.id;
    const itemId = parseInt(req.params.itemId);

    if (isNaN(itemId)) {
        return res.status(400).json({ error: 'Invalid item ID' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM cartitems WHERE id = $1 AND cart_id = (SELECT id FROM carts WHERE user_id = $2) RETURNING *',
            [itemId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found or not in your cart' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addItemToCart,
    getCart,
    removeItemFromCart,
};

