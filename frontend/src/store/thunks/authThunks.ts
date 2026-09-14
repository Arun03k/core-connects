import { createAsyncThunk } from '@reduxjs/toolkit';
import type { User, AuthTokens, AuthState } from '../slices/authSlice';
import { ApiError, apiRequest } from '../../services/apiClient';

export interface LoginCredentials { email: string; password: string }
export interface SignupCredentials extends LoginCredentials {
  firstName: string; lastName: string; confirmPassword: string; username?: string;
}
export interface AuthResponse { user: User; tokens: AuthTokens; emailSent?: boolean; message?: string }
export interface RefreshTokenResponse { accessToken: string; expiresIn: number; tokenType: string }
export interface ForgotPasswordRequest { email: string }
export interface ResetPasswordRequest { token: string; newPassword: string }
type Envelope<T> = { data: T; message: string };
type AuthPayload = AuthTokens & { user: User; emailSent?: boolean };
type State = { auth: AuthState };
const createAuthThunk = createAsyncThunk.withTypes<{ state: State; rejectValue: string }>();
const message = (error: unknown) => error instanceof Error ? error.message : 'The request failed.';
const post = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });
const authorization = (token: string) => ({ Authorization: `Bearer ${token}` });

function authResult(response: Envelope<AuthPayload>): AuthResponse {
  const { user, accessToken, refreshToken, expiresIn, tokenType, emailSent } = response.data;
  if (!user?.id || !accessToken || !refreshToken) throw new Error('Invalid sign-in response');
  return { user, tokens: { accessToken, refreshToken, expiresIn, tokenType }, emailSent, message: response.message };
}

export const loginUser = createAuthThunk<AuthResponse, LoginCredentials>('auth/login', async (credentials, { rejectWithValue }) => {
  try { return authResult(await apiRequest('/api/auth/login', post(credentials))); }
  catch (error) { return rejectWithValue(message(error)); }
});

export const signupUser = createAuthThunk<AuthResponse, SignupCredentials>('auth/signup', async (credentials, { rejectWithValue }) => {
  if (credentials.password !== credentials.confirmPassword) return rejectWithValue('Passwords do not match');
  try { return authResult(await apiRequest('/api/auth/register', post(credentials))); }
  catch (error) { return rejectWithValue(message(error)); }
});

export const logoutUser = createAuthThunk<void, void>('auth/logout', async (_, { getState }) => {
  const tokens = getState().auth.tokens;
  if (tokens) {
    try {
      await apiRequest('/api/auth/logout', { ...post({ refreshToken: tokens.refreshToken }), headers: authorization(tokens.accessToken) });
    } catch { /* Local credentials are always cleared by the reducer. */ }
  }
});

export const refreshToken = createAuthThunk<RefreshTokenResponse, void>('auth/refresh', async (_, { getState, rejectWithValue }) => {
  try {
    const tokens = getState().auth.tokens;
    if (!tokens) throw new Error('Please sign in again.');
    const result = await apiRequest<Envelope<RefreshTokenResponse>>('/api/auth/refresh', post({ refreshToken: tokens.refreshToken }));
    return result.data;
  } catch (error) { return rejectWithValue(message(error)); }
});

export const verifyToken = createAuthThunk<User, void>('auth/verify', async (_, { getState, rejectWithValue }) => {
  try {
    const tokens = getState().auth.tokens;
    if (!tokens) throw new Error('Please sign in again.');
    const result = await apiRequest<Envelope<{ user: User }>>('/api/auth/verify', { headers: authorization(tokens.accessToken) });
    return result.data.user;
  } catch (error) { return rejectWithValue(message(error)); }
});

export const restoreSession = createAuthThunk<AuthResponse | null, void>('auth/restore', async (_, { getState, rejectWithValue }) => {
  const tokens = getState().auth.tokens;
  if (!tokens) return null;
  try {
    let currentTokens = tokens;
    let result: Envelope<{ user: User }>;
    try {
      result = await apiRequest('/api/auth/verify', { headers: authorization(tokens.accessToken) });
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
      const refreshed = await apiRequest<Envelope<RefreshTokenResponse>>('/api/auth/refresh', post({ refreshToken: tokens.refreshToken }));
      currentTokens = { ...tokens, ...refreshed.data };
      result = await apiRequest('/api/auth/verify', { headers: authorization(currentTokens.accessToken) });
    }
    return { user: result.data.user, tokens: currentTokens };
  } catch (error) { return rejectWithValue(message(error)); }
}, { condition: (_, { getState }) => getState().auth.sessionStatus === 'idle' });

export const forgotPassword = createAuthThunk<void, ForgotPasswordRequest>('auth/forgotPassword', async (data, { rejectWithValue }) => {
  try { await apiRequest('/api/auth/forgot-password', post(data)); }
  catch (error) { return rejectWithValue(message(error)); }
});
export const resetPassword = createAuthThunk<void, ResetPasswordRequest>('auth/resetPassword', async (data, { rejectWithValue }) => {
  try { await apiRequest('/api/auth/reset-password', post(data)); }
  catch (error) { return rejectWithValue(message(error)); }
});
export const verifyEmail = createAuthThunk<void, string>('auth/verifyEmail', async (token, { rejectWithValue }) => {
  try { await apiRequest(`/api/auth/verify-email/${encodeURIComponent(token)}`); }
  catch (error) { return rejectWithValue(message(error)); }
});
export const resendVerification = createAuthThunk<void, string>('auth/resendVerification', async (email, { rejectWithValue }) => {
  try { await apiRequest('/api/auth/resend-verification', post({ email })); }
  catch (error) { return rejectWithValue(message(error)); }
});
