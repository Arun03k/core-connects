/**
 * Token refresh utility for automatic token renewal
 */
import { store } from '../store';
import { refreshToken, logoutUser } from '../thunks';

// Token refresh interval check (check every 5 minutes)
const REFRESH_CHECK_INTERVAL = 5 * 60 * 1000;

// Refresh token when less than 2 minutes remaining
const REFRESH_THRESHOLD = 2 * 60 * 1000;

let refreshInterval: NodeJS.Timeout | null = null;

/**
 * Start automatic token refresh monitoring
 */
export const startTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  refreshInterval = setInterval(async () => {
    const state = store.getState();
    const { accessToken, tokenExpiresIn, isAuthenticated } = state.auth;

    if (!isAuthenticated || !accessToken || !tokenExpiresIn) {
      return;
    }

    // Check if token is close to expiring (within threshold)
    const currentTime = Date.now();
    const tokenExpiryTime = currentTime + (tokenExpiresIn * 1000);
    const timeUntilExpiry = tokenExpiryTime - currentTime;

    if (timeUntilExpiry <= REFRESH_THRESHOLD) {
      try {
        await store.dispatch(refreshToken()).unwrap();
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, logout the user
        store.dispatch(logoutUser());
      }
    }
  }, REFRESH_CHECK_INTERVAL);
};

/**
 * Stop automatic token refresh monitoring
 */
export const stopTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

/**
 * Manually refresh the token if needed
 */
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  const state = store.getState();
  const { accessToken, tokenExpiresIn, isAuthenticated } = state.auth;

  if (!isAuthenticated || !accessToken || !tokenExpiresIn) {
    return false;
  }

  const currentTime = Date.now();
  const tokenExpiryTime = currentTime + (tokenExpiresIn * 1000);
  const timeUntilExpiry = tokenExpiryTime - currentTime;

  if (timeUntilExpiry <= REFRESH_THRESHOLD) {
    try {
      await store.dispatch(refreshToken()).unwrap();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      store.dispatch(logoutUser());
      return false;
    }
  }

  return true;
};

/**
 * Get current access token with automatic refresh if needed
 */
export const getAccessToken = async (): Promise<string | null> => {
  await refreshTokenIfNeeded();
  const state = store.getState();
  return state.auth.accessToken;
};