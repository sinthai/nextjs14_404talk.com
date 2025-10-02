import type { TokenData, UserData } from "@/types/auth/registration";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";
const TOKEN_EXPIRY_KEY = "tokenExpiry";

export const TokenManager = {
  setTokens(tokenData: TokenData, userData: UserData): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, tokenData.accessTokenExpiry);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUserData(): UserData | null {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  getTokenExpiry(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_EXPIRY_KEY);
  },

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;

    const expiryDate = new Date(expiry);
    const now = new Date();

    return expiryDate <= now;
  },

  updateAccessToken(accessToken: string, expiry: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry);
  },

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired();
  },

  getUserRole(): string | null {
    const userData = this.getUserData();
    return userData?.role || null;
  },

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === "admin";
  },
};
