import { createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../slices/authSlice';

// API base URL - Use environment variable or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api');

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  message?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Login thunk
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const data = await response.json();
      // Handle new response format
      if (data.status === 'success' && data.data) {
        return data.data;
      }
      return rejectWithValue(data.message || 'Login failed');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }
);

// Signup thunk
export const signupUser = createAsyncThunk<
  AuthResponse,
  SignupCredentials,
  { rejectValue: string }
>(
  'auth/signup',
  async (credentials, { rejectWithValue }) => {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        return rejectWithValue('Passwords do not match');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...signupData } = credentials;
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      // Handle new response format
      if (data.status === 'success' && data.data) {
        return data.data;
      }
      return rejectWithValue(data.message || 'Signup failed');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { getState }) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      const token = state.auth.accessToken;

      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      // Even if logout fails on server, we still clear local state
      console.warn('Logout request failed:', error);
    }
  }
);

// Verify token thunk (for checking if stored token is still valid)
export const verifyToken = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/verify',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      const token = state.auth.accessToken;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return rejectWithValue('Token verification failed');
      }

      const data = await response.json();
      // Handle new response format
      if (data.status === 'success' && data.data) {
        return data.data.user;
      }
      return rejectWithValue('Token verification failed');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Token verification failed'
      );
    }
  }
);

// Refresh token thunk
export const refreshToken = createAsyncThunk<
  RefreshTokenResponse,
  void,
  { rejectValue: string }
>(
  'auth/refresh',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { refreshToken: string | null } };
      const refreshTokenValue = state.auth.refreshToken;

      if (!refreshTokenValue) {
        return rejectWithValue('No refresh token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Token refresh failed');
      }

      const data = await response.json();
      // Handle new response format
      if (data.status === 'success' && data.data) {
        return data.data;
      }
      return rejectWithValue(data.message || 'Token refresh failed');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Token refresh failed'
      );
    }
  }
);
