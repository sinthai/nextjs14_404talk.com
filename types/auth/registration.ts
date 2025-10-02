export interface RegistrationRequest {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  userId?: string;
  message: string;
  errors: string[];
}

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
  returnUrl?: string | null;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  tokenType: string;
}

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: TokenData;
  user?: UserData;
  errors?: string[];
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  token?: TokenData;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}
