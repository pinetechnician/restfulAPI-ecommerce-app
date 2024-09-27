import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/products/productsSlice';  // Path might differ
import { fetchCategories } from '../../redux/categories/categoriesSlice';
import styles from './ProductsPage.module.css';  // Assuming you will add some styles

const ProductsPage = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());  // Fetch categories for the dropdown
    }, []);

    // Fetch products when the selected category changes
    useEffect(() => {
        if (selectedCategoryId !== '') {
            dispatch(fetchProducts(selectedCategoryId));
        } else {
            dispatch(fetchProducts());
        }
    }, [selectedCategoryId]);

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategoryId(categoryId);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.productsPage}>
        <h1>Our Products</h1>

        {/* Category Dropdown */}
        <select value={selectedCategoryId} onChange={handleCategoryChange}>
            <option value=''>All Categories</option>
            {categories.map((category) => (
            <option key={category.id} value={category.id}>
                {category.name}
            </option>
            ))}
        </select>

        <div className={styles.productsGrid}>
            {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>${product.price}</p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default ProductsPage;