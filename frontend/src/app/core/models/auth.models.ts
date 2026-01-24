import { User } from './user.model';

/**
 * Login request matching backend LoginDto
 * Supports login with either username or email (field named 'login' in backend)
 * but we use usernameOrEmail for clarity in frontend
 */
export interface LoginRequest {
  usernameOrEmail: string; // Backend calls it 'login'
  password: string;
}

/**
 * Registration request matching backend RegisterDto
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Refresh token request matching backend RefreshTokenDto
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Authentication response matching backend AuthResponseDto
 * Contains access/refresh tokens and user information
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Email verification request
 */
export interface EmailVerificationRequest {
  token: string;
}

/**
 * Forgot password request - initiates password reset flow
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request matching backend ResetPasswordDto
 */
export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

