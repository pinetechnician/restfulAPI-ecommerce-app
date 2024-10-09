import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css'; // Optional: Style for the NavBar

const NavBar = ({ isLoggedIn, onLogout, cartItemCount }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <Link to="/">E-Commerce</Link> {/* Brand or Home link */}
      </div>
      
      <ul className={styles.navbarLinks}>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/cart">
            Cart {cartItemCount > 0 && <span>({cartItemCount})</span>}
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/orders">Orders</Link>
            </li>
            <li>
              <Link to="/profile">My Account</Link>
            </li>
            <li>
              <button onClick={onLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;