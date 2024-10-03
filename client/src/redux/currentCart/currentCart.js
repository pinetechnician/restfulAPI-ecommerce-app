import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks for cart actions
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await axios.get('/api/api/cart');
  return response.data;
});

export const addToCart = createAsyncThunk('cart/addToCart', async (product) => {
  const response = await axios.post('/api/api/cart', product);
  return response.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId) => {
  const response = await axios.delete(`/api/api/cart/items/${productId}`);
  return response.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartId: null,
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.cartId = action.payload.cartId;
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
        console.log(action.payload);
        if (state.items[0].itemId == null) {
            state.totalAmount = 0
        } 
        console.log(state.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Find the existing item in the state (if it exists)
        const existingItem = state.items.find(item => item.product_id === action.payload.product_id);

        if (existingItem) {
        // Update the existing item's quantity
        existingItem.quantity = action.payload.quantity;
        } else {
          // Add the new item to the state
          state.items.push(action.payload);
        }

        // Update total quantity and total amount
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + item.product_price * item.quantity, 0);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        //console.log('cart items: ', state.items);
        console.log(JSON.stringify(action.payload));
        state.totalAmount -= action.payload.quantity;
        if (state.items.length === 0) {
            state.totalAmount = 0;
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove item from cart';
      });
  },
});

export default cartSlice.reducer;