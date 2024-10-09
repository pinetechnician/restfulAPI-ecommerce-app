import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/products/productsSlice';
import { addToCart } from '../../redux/currentCart/currentCart';
import styles from './ProductDetails.module.css'; // Assuming you will add some styles

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.products);
    const [quantity, setQuantity] = useState();

    console.log('product: ', product);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (product && product[0]) {
            setQuantity(product[0].qty1);  // Set the initial quantity to qty1
        }
    }, [product]);

    const handleBlur = () => {
        if (product && product[0] && quantity < product[0].qty1) {
            setQuantity(product[0].qty1);  // Ensure the minimum quantity is respected
        }
    };

    const handleAddToCart = () => {
        const finalQuantity = Math.max(quantity, product[0].qty1);
        dispatch(addToCart({ productId: product[0].id, quantity: finalQuantity }));
      };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.productDetails}>
            {product ? (
                <>
                    <h1>{product[0].description}</h1>
                    <img src={product[0].image} alt={product.name} />
                    <p>{product[0].description}</p>
                    <p>Item Number: {product[0].item_number}</p>
                    {product[0].availability ? <p>Availability: Sold Out</p> : <p>Availability: In stock</p>}
                    <table className={styles.pricingTable}>
                        <thead>
                            <tr>
                                <th>Price per unit</th>
                                <th>Minimum Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product[0].price1 && product[0].qty1 && (
                                <tr>
                                    <td>${product[0].price1}</td>
                                    <td>{product[0].qty1}</td>
                                </tr>
                            )}
                            {product[0].price2 && product[0].qty2 && (
                                <tr>
                                    <td>${product[0].price2}</td>
                                    <td>{product[0].qty2}</td>
                                </tr>
                            )}
                            {product[0].price3 && product[0].qty3 && (
                                <tr>
                                    <td>${product[0].price3}</td>
                                    <td>{product[0].qty3}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <label htmlFor="quantity">Select Quantity:</label>
                    {product[0].qty1 && (
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            min={product[0].qty1} // Minimum quantity is qty1
                            onChange={(e) => setQuantity(Number(e.target.value), product[0].qty1)}  // Ensure the value is not below qty1
                            onBlur={handleBlur}
                        />
                    )}
                    <button onClick={handleAddToCart}>Add to Cart</button>
                </>
            ) : (
                <p>Product not found.</p>
            )}
        </div>
    );
};

export default ProductDetails;