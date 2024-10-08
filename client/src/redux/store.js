// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productsReducer from './products/productsSlice';
import categoriesReducer from './categories/categoriesSlice';
import cartReducer from './currentCart/currentCart';
import profileReducer from './profile/profileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, 
    products: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    profile: profileReducer,
  },
});

export default store;