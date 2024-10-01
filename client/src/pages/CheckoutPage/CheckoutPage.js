import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Load Stripe
const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutPage = () => {
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  useEffect(() => {
    // Call your backend to create the PaymentIntent and get the ID
    const createPaymentIntent = async () => {
      const response = await fetch('/create-payment-intent', { method: 'POST' });
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