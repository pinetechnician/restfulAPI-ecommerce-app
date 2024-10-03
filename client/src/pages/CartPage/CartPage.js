import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../../redux/currentCart/currentCart';

const Cart = ({ isLoggedIn }) => {
  const dispatch = useDispatch();
  const { items, totalAmount, totalQuantity } = useSelector(state => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    dispatch(fetchCart());
  };

  const handleCheckoutClick = () => {
    navigate('/checkout');
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {totalQuantity === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.itemId}>
              <h2>{item.productName}</h2>
              <p>${item.unitPrice} x {item.quantity}</p>
              <button onClick={() => handleRemoveFromCart(item.itemId)}>Remove</button>
            </div>
          ))}
          <p>Total: ${totalAmount}</p>
          {isLoggedIn && (
            <button onClick={handleCheckoutClick}>
            Proceed to Checkout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;