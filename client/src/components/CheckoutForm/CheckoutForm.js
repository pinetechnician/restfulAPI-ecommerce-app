import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ paymentIntentId, onPaymentSuccess, totalAmount, cartId, clientSecret }) => {
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
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Customer Name',
        },
      },
    });

    console.log(`payment intent: ${JSON.stringify(paymentIntent)}`);
  
    if (error) {
      // Handle error (e.g., declined card, incomplete authentication)
      setErrorMessage(error.message);
      setIsProcessing(false);
      return;
    } 
    
    if (paymentIntent.status === 'requires_capture') {
      // Payment authorized, but not yet captured
      setPaymentSuccess(true);
  
      // Finalize the order on the backend after authorization
      try {
        const response = await fetch(`/api/api/cart/${cartId}/finalize-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentIntentId }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          if (onPaymentSuccess) {
            onPaymentSuccess(paymentIntent);
          }
          setIsProcessing(false);
          return;
        } else {
          setErrorMessage(data.error || 'Failed to finalize the order.');
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        setErrorMessage('An error occurred while finalizing the order.');
        console.error('Finalization error:', err); // Log error details
        setIsProcessing(false);
        return;
      }
  
      setIsProcessing(false);
    } else {
      // Handle other statuses if necessary
      setErrorMessage('Payment could not be completed. Please try again.');
      setIsProcessing(false);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }} />
      
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : `Pay $${totalAmount}`}
      </button>

      {paymentSuccess && <div className="success-message">Payment authorized, you will be charged once your order is confirmed!</div>}
    </form>
  );
};

export default CheckoutForm;