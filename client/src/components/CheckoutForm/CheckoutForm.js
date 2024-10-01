import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ paymentIntentId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Confirm the PaymentIntent on the client-side
    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentId, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Customer Name',
        },
      },
    });

    if (error) {
      // Handle error (e.g., declined card, incomplete authentication)
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === 'requires_capture') {
      // Payment authorized, but not yet captured
      setPaymentSuccess(true);
      setIsProcessing(false);
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentIntent);
      }
    } else {
      // Handle other statuses if necessary
      setErrorMessage('Payment could not be completed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>

      {paymentSuccess && <div className="success-message">Payment authorized, you will be charged once your order is confirmed!</div>}
    </form>
  );
};

export default CheckoutForm;