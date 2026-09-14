// Storage can be disabled by browser privacy settings; keep in-memory auth usable.
export const authStorage = {
  getItem(key: string): string | null { try { return sessionStorage.getItem(key); } catch { return null; } },
  setItem(key: string, value: string): void { try { sessionStorage.setItem(key, value); } catch { /* Session stays in memory. */ } },
  removeItem(key: string): void { try { sessionStorage.removeItem(key); } catch { /* Storage unavailable. */ } },
};

// Token utility functions
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export const getStoredTokens = (): TokenData | null => {
  try {
    const accessToken = authStorage.getItem('accessToken');
    const refreshToken = authStorage.getItem('refreshToken');
    const expiresIn = authStorage.getItem('tokenExpiresIn');
    
    if (accessToken && refreshToken && expiresIn) {
      return {
        accessToken,
        refreshToken,
        expiresIn: parseInt(expiresIn),
        tokenType: 'Bearer'
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return null;
  }
};

export const storeTokens = (tokens: TokenData): void => {
  try {
    authStorage.setItem('accessToken', tokens.accessToken);
    authStorage.setItem('refreshToken', tokens.refreshToken);
    authStorage.setItem('tokenExpiresIn', tokens.expiresIn.toString());
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

export const clearStoredTokens = (): void => {
  try {
    authStorage.removeItem('accessToken');
    authStorage.removeItem('refreshToken');
    authStorage.removeItem('tokenExpiresIn');
    authStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

export const isTokenExpired = (expiresAt: number): boolean => {
  const now = Date.now() / 1000;
  return !Number.isFinite(expiresAt) || now >= expiresAt;
};
