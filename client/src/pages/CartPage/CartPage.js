import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../../redux/currentCart/currentCart';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);


  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = async (productId) => {
    await dispatch(removeFromCart(productId));
    dispatch(fetchCart());
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.itemId}>
              <h2>{item.productName}</h2>
              <p>{item.price} x {item.quantity}</p>
              <button onClick={() => handleRemoveFromCart(item.itemId)}>Remove</button>
            </div>
          ))}
          <p>Total: ${totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default Cart;