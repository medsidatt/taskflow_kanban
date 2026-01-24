import { User } from './user.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  login: string; // Matches LoginDto (username or email)
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}