import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/auth/authSlice';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import NavBar from '../components/Navbar/NavBar';
import Login from '../pages/LoginPage/LoginPage';
import Profile from '../pages/ProfilePage/ProfilePage';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const cartItemCount = 3;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <NavBar 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        cartItemCount={cartItemCount}
      />
      <Routes>
        {/* Other routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
