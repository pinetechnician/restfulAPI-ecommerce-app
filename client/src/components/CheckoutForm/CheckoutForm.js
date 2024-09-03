import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import styles from './CheckoutForm.module.css';

function CheckoutForm() {

  const dispatch = useDispatch();
  const elements = useElements();
  const stripe = useStripe();

  const cart = useSelector(state => state.cart);

  const [isPaymentLoading, setPaymentLoading] = useState(false);

  async function processPayment(e) {
    e.preventDefault();

    const { clientSecret } = await fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartId: 'your_cart_id' })
    }).then(res => res.json());

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
                name: 'Your customer\'s name'
            },
        }
    });

    if (error) {
        // Show error to your customer (e.g., invalid card details)
        console.error('Payment failed:', error.message);
        alert('Payment failed: ' + error.message);
    } else if (paymentIntent.status === 'succeeded') {
        // The payment has been processed!
        // Now, you can safely create the order and clear the cart on the server
        await fetch('/finalize-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        }).then(res => res.json());

        alert('Payment succeeded and order is placed!');
        // Redirect the user to a success page, etc.
    }

    if (!stripe || !elements) {
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      
      const { token } = await stripe.createToken(cardElement);

      await dispatch(checkoutCart({cartId: cart.id, paymentInfo: token}));

    } catch(err) {
      throw err;
    }
  }

  return (
    <div style={{ padding: "3rem", width: '100%'}}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <form style={{ display: "block", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CardElement
              className="card"
              options={{
                style: {
                  base: {
                    backgroundColor: "white"
                  } 
                }
              }}
            />
            <button
              className="pay-button"
              disabled={isPaymentLoading}
              onClick={processPayment}
            >
              {isPaymentLoading ? "Loading..." : "Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutForm;