import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm';

// Load Stripe
const stripePromise = loadStripe('pk_test_51Pv2hUAh0rCB3FEGAT2O3Vk14zVPoBmbS8huPvUtdSVCplQCaF6k04MgFgh20YaqzLqDk6uhxEDTmTI5pQbClF3t000EGSAmCm');

const CheckoutPage = () => {
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const cartId = useSelector((state) => state.cart.cartId);

  useEffect(() => {
    // Call your backend to create the PaymentIntent and get the ID
    const createPaymentIntent = async () => {
      const response = await fetch(`/api/api/cart/${cartId}/checkout`, { method: 'POST' });
      const data = await response.json();
      setPaymentIntentId(data.paymentIntentId);
    };

    createPaymentIntent();
  }, []);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment authorized, PaymentIntent:', paymentIntent);
    // Additional logic, e.g., updating the UI or proceeding to the next step
  };

  return (
    <Elements stripe={stripePromise}>
      {paymentIntentId ? (
        <CheckoutForm paymentIntentId={paymentIntentId} onPaymentSuccess={handlePaymentSuccess} />
      ) : (
        <p>Loading payment details...</p>
      )}
    </Elements>
  );
};

export default CheckoutPage;