import { createAsyncThunk } from '@reduxjs/toolkit';
import type { User, AuthTokens } from '../slices/authSlice';

// API base URL - Use environment variable with proper fallbacks
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 
                     ((import.meta as any).env.DEV ? 'http://localhost:5000' : 'https://core-connects.onrender.com');

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
  username?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  emailSent?: boolean;
  message?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Check if response is JSON by looking at content-type header
      const contentType = response.headers.get('content-type');
      const isJsonResponse = contentType && contentType.includes('application/json');

      if (!response.ok) {
        // Handle non-JSON responses (like HTML error pages)
        if (!isJsonResponse) {
          const textResponse = await response.text();
          console.error('Non-JSON error response:', textResponse);
          return rejectWithValue(`Server error (${response.status}): The server returned an unexpected response. Please try again later.`);
        }

        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          return rejectWithValue(`Server error (${response.status}): Unable to process server response`);
        }

        return rejectWithValue(errorData.message || 'Login failed');
      }

      // Handle successful response
      if (!isJsonResponse) {
        console.error('Non-JSON success response received');
        return rejectWithValue('Server returned an unexpected response format');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError);
        return rejectWithValue('Unable to process server response');
      }
      
      // Transform response to match expected format
      return {
        user: data.data.user,
        tokens: {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: data.data.expiresIn,
          tokenType: data.data.tokenType
        },
        message: data.message
      };
    } catch (error) {
      console.error('Login network error:', error);
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
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      // Check if response is JSON by looking at content-type header
      const contentType = response.headers.get('content-type');
      const isJsonResponse = contentType && contentType.includes('application/json');

      if (!response.ok) {
        // Handle non-JSON responses (like HTML error pages)
        if (!isJsonResponse) {
          const textResponse = await response.text();
          console.error('Non-JSON error response:', textResponse);
          return rejectWithValue(`Server error (${response.status}): The server returned an unexpected response. Please try again later.`);
        }

        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          return rejectWithValue(`Server error (${response.status}): Unable to process server response`);
        }

        return rejectWithValue(errorData.message || 'Registration failed');
      }

      // Handle successful response
      if (!isJsonResponse) {
        console.error('Non-JSON success response received');
        return rejectWithValue('Server returned an unexpected response format');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError);
        return rejectWithValue('Unable to process server response');
      }
      
      // Transform response to match expected format
      return {
        user: data.data.user,
        tokens: {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          expiresIn: data.data.expiresIn,
          tokenType: data.data.tokenType
        },
        emailSent: data.data.emailSent,
        message: data.message
      };
    } catch (error) {
      console.error('Signup network error:', error);
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
      const state = getState() as { auth: { tokens: { refreshToken: string } | null } };
      const refreshToken = state.auth.tokens?.refreshToken;

      if (refreshToken) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
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
      const state = getState() as { auth: { tokens: { accessToken: string } | null } };
      const accessToken = state.auth.tokens?.accessToken;

      if (!accessToken) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return rejectWithValue('Token verification failed');
      }

      const data = await response.json();
      return data.data.user;
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
      const state = getState() as { auth: { tokens: { refreshToken: string } | null } };
      const refreshTokenValue = state.auth.tokens?.refreshToken;

      if (!refreshTokenValue) {
        return rejectWithValue('No refresh token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        return rejectWithValue('Token refresh failed');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Token refresh failed'
      );
    }
  }
);

// Forgot password thunk
export const forgotPassword = createAsyncThunk<
  void,
  ForgotPasswordRequest,
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async (request, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to send password reset email');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }
);

// Reset password thunk
export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordRequest,
  { rejectValue: string }
>(
  'auth/resetPassword',
  async (request, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to reset password');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }
);

// Verify email thunk
export const verifyEmail = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email/${token}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Email verification failed');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }
);

// Resend verification thunk
export const resendVerification = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to resend verification email');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }
);
