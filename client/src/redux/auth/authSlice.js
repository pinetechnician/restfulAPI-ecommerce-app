// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to handle login
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/api/users/login', credentials); // API call to login
    return response.data.user; // Return user data
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Login failed');
  }
});

// Auth slice 
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        console.log(state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;