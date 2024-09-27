// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice';
import categoriesReducer from './categories/categoriesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, 
    products: productsReducer,
    categories: categoriesReducer,
  },
});

export default store;