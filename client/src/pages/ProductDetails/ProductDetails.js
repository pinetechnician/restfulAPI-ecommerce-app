import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/products/productsSlice';
import styles from './ProductDetails.module.css'; // Assuming you will add some styles

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.products);

    console.log('product: ', product);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.productDetails}>
            {product ? (
                <>
                    <h1>{product[0].description}</h1>
                    <img src={product[0].image} alt={product.name} />
                    <p>{product[0].description}</p>
                    <p>Price: ${product[0].price}</p>
                    <p>Item Number: {product[0].item_number}</p>
                    {product.availability ? <p>Availability: Sold Out</p> : <p>Availability: In stock</p>}
                    {/* Add other relevant details */}
                </>
            ) : (
                <p>Product not found.</p>
            )}
        </div>
    );
};

export default ProductDetails;