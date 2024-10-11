import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm';
import withSessionCheck from '../../components/WithSessionCheck/WithSessionCheck';

// Load Stripe
const stripePromise = loadStripe('pk_test_51Pv2hUAh0rCB3FEGAT2O3Vk14zVPoBmbS8huPvUtdSVCplQCaF6k04MgFgh20YaqzLqDk6uhxEDTmTI5pQbClF3t000EGSAmCm');

const CheckoutPage = () => {
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const cartId = useSelector((state) => state.cart.cartId);
  const cartItems = useSelector((state) => state.cart.items); 
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Call your backend to create the PaymentIntent and get the ID
    const createPaymentIntent = async () => {
      const response = await fetch(`/api/api/cart/${cartId}/checkout`, { method: 'POST' });
      const data = await response.json();
      setPaymentIntentId(data.paymentIntentId);
      setClientSecret(data.clientSecret);
      setTotalAmount(data.total);
    };

    createPaymentIntent();
  }, [cartId]);

  console.log(typeof cartId);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment authorized, PaymentIntent:', paymentIntent);
    // Additional logic, e.g., updating the UI or proceeding to the next step
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Display Cart Items */}
      <div className="cart-summary">
        <h3>Your Items</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.product_id}>
              <p>{item.productName} - Qty: {item.quantity}</p>
              <p>${item.productPrice}</p>
            </li>
          ))}
        </ul>
        <h3>Total: ${totalAmount}</h3>
      </div>

      <Elements stripe={stripePromise}>
        {paymentIntentId ? (
          <CheckoutForm 
            paymentIntentId={paymentIntentId} 
            onPaymentSuccess={handlePaymentSuccess}
            totalAmount={totalAmount} 
            cartId={cartId}
            clientSecret={clientSecret}
          />
        ) : (
          <p>Loading payment details...</p>
        )}
      </Elements>
    </div>
  );
};

export default withSessionCheck(CheckoutPage);