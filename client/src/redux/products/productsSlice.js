import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (category = '') => {
  try {
    // Check if a category is provided and build the query string accordingly
    const categoryQuery = category ? `?category=${category}` : '';
    const response = await axios.get(`/api/api/products${categoryQuery}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to fetch products';
  }
});

// Thunk to fetch products based on search
export const searchProducts = createAsyncThunk('products/searchProducts', async (searchTerm) => {
  const response = await axios.get(`/api/api/products/search?searchQuery=${searchTerm}`);
  return response.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchProducts.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
