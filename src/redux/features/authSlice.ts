'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { clearAuthCookies } from '@/lib/auth';
import { UserInfo } from '@/lib/types';
import { LoginFormData } from "@/schema/auth";

// Initialize state from cookies if available
const getUserFromCookie = () => {
  if (typeof document === 'undefined') return null;
  try {
    const userInfo = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_info='));
    if (userInfo) {
      return JSON.parse(decodeURIComponent(userInfo.split('=')[1]));
    }
  } catch (error) {
    console.error('Error parsing user info from cookie:', error);
  }
  return null;
};


interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: getUserFromCookie(),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await clearAuthCookies();
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })

  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
