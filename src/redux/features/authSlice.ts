'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LoginInput } from '@/lib/auth';
import { UserInfo } from '@/lib/types';

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

const getAuthStatus = () => {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('access_token=');
};

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: getUserFromCookie(),
  isAuthenticated: getAuthStatus(),
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginInput, { rejectWithValue }) => {
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

      // Get user info after successful login
      const userResponse = await fetch('/api/user');
      if (!userResponse.ok) {
        return rejectWithValue('Failed to fetch user info');
      }

      const userData = await userResponse.json();
      return userData;
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
      await fetch('/api/logout', { method: 'POST' });
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Async thunk for fetching user info
export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) {
        return rejectWithValue('Failed to fetch user info');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue('An unexpected error occurred');
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
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
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
      // Fetch user info cases
      .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
