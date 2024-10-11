import React from 'react';
import { useLocation } from 'react-router-dom';
import withSessionCheck from '../../components/WithSessionCheck/WithSessionCheck';
import styles from './OrderConfirmation.module.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, totalAmount } = location.state || {};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thank You for Your Order!</h1>
      <div className={styles.message}>
        <p>Your payment was successful.</p>
      </div>
      <div className={styles.orderDetails}>
        <p className={styles.detail}>Order ID: <strong>{orderId}</strong></p>
        <p className={styles.detail}>Total Amount Charged: <strong>${totalAmount.toFixed(2)}</strong></p>
      </div>
      <p className={styles.successMessage}>
        You will receive an order confirmation email shortly.
      </p>
      <button onClick={() => window.location.href = '/'}>Return to Home</button>
    </div>
  );
};

export default withSessionCheck(OrderConfirmation);