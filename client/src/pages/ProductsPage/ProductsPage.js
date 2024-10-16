import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, searchProducts } from '../../redux/products/productsSlice';  // Path might differ
import { fetchCategories } from '../../redux/categories/categoriesSlice';
import styles from './ProductsPage.module.css';  // Assuming you will add some styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const ProductsPage = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());  // Fetch categories for the dropdown
    }, []);

    // Fetch products when the selected category changes
    useEffect(() => {
        if (selectedCategoryId !== '') {
            dispatch(fetchProducts(selectedCategoryId));
        } else if (!searchTerm) {
            dispatch(fetchProducts());
        }
    }, [selectedCategoryId]);

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategoryId(categoryId);
        setSearchTerm('');  // Clear search term when a category is selected
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSelectedCategoryId('');
            dispatch(searchProducts(searchTerm));
        } else {
            setSelectedCategoryId('');  // Reset category selection when search is performed
            dispatch(fetchProducts());
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.productsPage}>
        <h1>Our Products</h1>

         {/* Search Input */}
         <form onSubmit={handleSearch} className={styles.searchContainer} >
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by item number or description..."
            />
            <button type="submit" className={styles.searchButton} >
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </form>

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
                <Link to={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                    <h2>{product.name}</h2>
                </Link>
                <p>{product.description}</p>
                <p>${product.price}</p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default ProductsPage;