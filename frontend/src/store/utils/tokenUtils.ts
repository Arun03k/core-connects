// Token utility functions
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export const getStoredTokens = (): TokenData | null => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresIn = localStorage.getItem('tokenExpiresIn');
    
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
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('tokenExpiresIn', tokens.expiresIn.toString());
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

export const clearStoredTokens = (): void => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresIn');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

export const isTokenExpired = (expiresIn: number): boolean => {
  const now = Date.now() / 1000;
  return now >= expiresIn;
};
