// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutFromServer } from '../api/api';
import { logout } from '../redux/auth/authSlice';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import NavBar from '../components/Navbar/NavBar';
import Login from '../pages/LoginPage/LoginPage';
import Profile from '../pages/ProfilePage/ProfilePage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import Cart from '../pages/CartPage/CartPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import OrderConfirmation from '../pages/OrderConfirmation/OrderConfirmation';
import OrdersPage from '../pages/OrdersPage/OrdersPage';
import OrderDetails from '../pages/OrderDetails/OrderDetails';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import { useNavigate } from 'react-router-dom'; 

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItemCount = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate(); // Use navigate inside the Router

  const handleLogout = async () => {
    try {
      await logoutFromServer(); // Call the server to log out
      dispatch(logout());       // Update Redux state to log out
      navigate('/login');       // Redirect to login after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <NavBar 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
      />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart isLoggedIn={isLoggedIn} />} />
        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/orders/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
      </Routes>
    </>
  );
};

// Top-level component where you wrap everything inside Router
const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
