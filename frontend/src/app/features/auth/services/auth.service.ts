import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../../../core/models/auth.models';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Login with username or email
   * Maps usernameOrEmail to backend's 'login' field
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    // Map frontend field to backend DTO field name
    const backendRequest = {
      login: request.usernameOrEmail,
      password: request.password
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, backendRequest).pipe(
      tap((response: AuthResponse) => this.handleAuthResponse(response)),
      catchError((error: unknown) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap((response: AuthResponse) => this.handleAuthResponse(response)),
      catchError((error: unknown) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, request).pipe(
      tap((response: AuthResponse) => this.handleAuthResponse(response)),
      catchError((error: unknown) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user - clear tokens and user data
   */
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Verify email with token
   */
  verifyEmail(request: EmailVerificationRequest): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/verify`, {
      params: { token: request.token }
    }).pipe(
      catchError((error: unknown) => {
        console.error('Email verification failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Request password reset - sends email with reset link
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/forgot-password`, {}, {
      params: { email: request.email }
    }).pipe(
      catchError((error: unknown) => {
        console.error('Forgot password request failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Reset password with new password
   */
  resetPassword(request: ResetPasswordRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/reset-password`, request).pipe(
      catchError((error: unknown) => {
        console.error('Password reset failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get current user signal
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Handle auth response - store tokens and user data
   */
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  /**
   * Retrieve user from local storage
   */
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
