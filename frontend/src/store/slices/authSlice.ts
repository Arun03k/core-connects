import { authStorage } from '../utils/tokenUtils';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { 
  loginUser, 
  signupUser, 
  logoutUser, 
  verifyToken, 
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  restoreSession
} from '../thunks';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
  isVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  sessionStatus: "idle" | "checking" | "ready";
  sessionRequestId: string | null;
  isLoading: boolean;
  error: string | null;
  emailVerificationSent: boolean;
  passwordResetSent: boolean;
}

// Load initial state from sessionStorage
const loadInitialState = (): Partial<AuthState> => {
  try {
    const accessToken = authStorage.getItem('accessToken');
    const refreshToken = authStorage.getItem('refreshToken');
    const expiresIn = authStorage.getItem('tokenExpiresIn');
    const user = authStorage.getItem('user');
    
    if (accessToken && refreshToken && user) {
      return {
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: parseInt(expiresIn || '900'),
          tokenType: 'Bearer'
        },
        user: JSON.parse(user),
        isAuthenticated: false,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state from sessionStorage:', error);
    // Clear corrupted data
    authStorage.removeItem('accessToken');
    authStorage.removeItem('refreshToken');
    authStorage.removeItem('tokenExpiresIn');
    authStorage.removeItem('user');
  }
  
  return {
    tokens: null,
    user: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = {
  ...loadInitialState(),
  isLoading: false,
  sessionStatus: "idle",
  sessionRequestId: null,
  error: null,
  emailVerificationSent: false,
  passwordResetSent: false,
} as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      // Update sessionStorage
      authStorage.setItem('accessToken', action.payload.accessToken);
      authStorage.setItem('refreshToken', action.payload.refreshToken);
      authStorage.setItem('tokenExpiresIn', action.payload.expiresIn.toString());
    },
    clearAuth: (state) => {
      state.sessionRequestId = null;
      state.sessionStatus = 'ready';
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      state.emailVerificationSent = false;
      state.passwordResetSent = false;
      
      // Clear sessionStorage
      authStorage.removeItem('accessToken');
      authStorage.removeItem('refreshToken');
      authStorage.removeItem('tokenExpiresIn');
      authStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        authStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state, action) => { state.sessionStatus = 'checking'; state.sessionRequestId = action.meta.requestId; })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (state.sessionRequestId !== action.meta.requestId) return;
        state.sessionRequestId = null;
        state.sessionStatus = 'ready';
        state.user = action.payload?.user ?? null;
        state.tokens = action.payload?.tokens ?? null;
        state.isAuthenticated = Boolean(action.payload);
        if (action.payload) {
          authStorage.setItem('accessToken', action.payload.tokens.accessToken);
          authStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(restoreSession.rejected, (state, action) => {
        if (state.sessionRequestId !== action.meta.requestId) return;
        state.sessionRequestId = null;
        state.sessionStatus = 'ready';
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Please sign in again.';
        for (const key of ['accessToken', 'refreshToken', 'tokenExpiresIn', 'user']) authStorage.removeItem(key);
      });
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.sessionRequestId = null;
        state.sessionStatus = 'ready';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.sessionStatus = 'ready';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.error = null;
        
        // Store in sessionStorage
        authStorage.setItem('accessToken', action.payload.tokens.accessToken);
        authStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
        authStorage.setItem('tokenExpiresIn', action.payload.tokens.expiresIn.toString());
        authStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
        state.error = action.payload as string;
        
        // Clear sessionStorage
        authStorage.removeItem('accessToken');
        authStorage.removeItem('refreshToken');
        authStorage.removeItem('tokenExpiresIn');
        authStorage.removeItem('user');
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.sessionRequestId = null;
        state.sessionStatus = 'ready';
        state.isLoading = true;
        state.error = null;
        state.emailVerificationSent = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.sessionStatus = 'ready';
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.error = null;
        state.emailVerificationSent = action.payload.emailSent || false;
        
        // Store in sessionStorage
        authStorage.setItem('accessToken', action.payload.tokens.accessToken);
        authStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
        authStorage.setItem('tokenExpiresIn', action.payload.tokens.expiresIn.toString());
        authStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
        state.error = action.payload as string;
        state.emailVerificationSent = false;
        
        // Clear sessionStorage
        authStorage.removeItem('accessToken');
        authStorage.removeItem('refreshToken');
        authStorage.removeItem('tokenExpiresIn');
        authStorage.removeItem('user');
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.sessionRequestId = null;
        state.sessionStatus = 'ready';
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
        state.error = null;
        state.emailVerificationSent = false;
        state.passwordResetSent = false;
        
        // Clear sessionStorage
        authStorage.removeItem('accessToken');
        authStorage.removeItem('refreshToken');
        authStorage.removeItem('tokenExpiresIn');
        authStorage.removeItem('user');
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails on server, clear local state
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
        state.error = null;
        state.emailVerificationSent = false;
        state.passwordResetSent = false;
        
        // Clear sessionStorage
        authStorage.removeItem('accessToken');
        authStorage.removeItem('refreshToken');
        authStorage.removeItem('tokenExpiresIn');
        authStorage.removeItem('user');
      });

    // Verify token
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        
        // Update user in sessionStorage
        authStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
        state.error = null;
        
        // Clear sessionStorage
        authStorage.removeItem('accessToken');
        authStorage.removeItem('refreshToken');
        authStorage.removeItem('tokenExpiresIn');
        authStorage.removeItem('user');
      });

    // Refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.tokens) {
          state.tokens.accessToken = action.payload.accessToken;
          state.tokens.expiresIn = action.payload.expiresIn;
          
          // Update sessionStorage
          authStorage.setItem('accessToken', action.payload.accessToken);
          authStorage.setItem('tokenExpiresIn', action.payload.expiresIn.toString());
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = null;
        state.error = 'Session expired. Please login again.';
        
        // Clear sessionStorage
        authStorage.removeItem('accessToken');
        authStorage.removeItem('refreshToken');
        authStorage.removeItem('tokenExpiresIn');
        authStorage.removeItem('user');
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSent = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetSent = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.passwordResetSent = false;
        state.error = action.payload as string;
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetSent = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        if (state.user) {
          state.user.isVerified = true;
          authStorage.setItem('user', JSON.stringify(state.user));
        }
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Resend verification
    builder
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.emailVerificationSent = true;
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLoading, updateTokens, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
