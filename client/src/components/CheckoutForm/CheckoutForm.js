import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import styles from './CheckoutForm.module.css';

const CheckoutForm = ({ paymentIntentId, onPaymentSuccess, totalAmount, cartId, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [cardError, setCardError] = useState('');
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
        ...formValues,
        [name]: value,
    });
  };

  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : '');
    setIsCardComplete(event.complete);
  };

  const validateForm = () => {
    let errors = {};
    if (!formValues.name.trim()) errors.name = 'Name is required';
    if (!formValues.email.trim()) errors.email = 'Email is required';
    if (!formValues.address.trim()) errors.address = 'Address is required';
    if (!formValues.city.trim()) errors.city = 'City is required';
    if (!formValues.state.trim()) errors.state = 'State is required';
    if (!formValues.zipcode.trim()) errors.zipcode = 'Zipcode is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0 && isCardComplete;
  }

  // Update form validity whenever form values or card status change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formValues, isCardComplete]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!validateForm() || !isCardComplete) {
        setErrorMessage('Please complete all required fields');
        setIsProcessing(false);
        return;
    }
  
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
          name: formValues.name,
          email: formValues.email,
          address: {
            line1: formValues.address,
            city: formValues.city,
            state: formValues.state,
            postal_code: formValues.zipcode,
          },
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

          navigate('/order-confirmation', { state: { totalAmount, orderId: data.orderId } });
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
    <form className={styles.checkoutForm} onSubmit={handleSubmit}>
        <div className={styles.formField}>
            <label>Name</label>
            <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
            />
            {formErrors.name && <span className={styles.error}>{formErrors.name}</span>}
        </div>

        <div className={styles.formField}>
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
            />
            {formErrors.email && <span className={styles.error}>{formErrors.email}</span>}
        </div>

        <div className={styles.twoColumn}>
        <div className={styles.formField}>
            <label>Address</label>
            <input
                type="text"
                name="address"
                value={formValues.address}
                onChange={handleChange}
            />
            {formErrors.address && <span className={styles.error}>{formErrors.address}</span>}
        </div>

        <div className={styles.formField}>
            <label>City</label>
            <input
                type="text"
                name="city"
                value={formValues.city}
                onChange={handleChange}
            />
            {formErrors.city && <span className={styles.error}>{formErrors.city}</span>}
        </div>
        </div>

        <div className={styles.twoColumn}>
        <div className={styles.formField}>
            <label>State</label>
            <input
                type="text"
                name="state"
                value={formValues.state}
                onChange={handleChange}
            />
            {formErrors.state && <span className={styles.error}>{formErrors.state}</span>}
        </div>

        <div className={styles.formField}>
            <label>Zipcode</label>
            <input
                type="text"
                name="zipcode"
                value={formValues.zipcode}
                onChange={handleChange}
            />
            {formErrors.zipcode && <span className={styles.error}>{formErrors.zipcode}</span>}
        </div>
        </div>

        <div className={styles.cardField}>
            <label>Card Details</label>
            <CardElement options={{ hidePostalCode: true }} onChange={handleCardChange}/>
            {cardError && <span className={styles.error}>{cardError}</span>}
        </div>
      
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      
        <button type="submit" disabled={!stripe || isProcessing || !isFormValid}>
            {isProcessing ? 'Processing...' : `Pay $${totalAmount}`}
        </button>

        {paymentSuccess && <div className={styles.successMessage}>Payment authorized, you will be charged once your order is confirmed!</div>}
    </form>
  );
};

export default CheckoutForm;