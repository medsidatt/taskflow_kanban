import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../../../core/models/auth.models';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // List of auth endpoints that should not trigger token refresh
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/verify', '/auth/forgot-password', '/auth/reset-password'];
  const isAuthEndpoint = authEndpoints.some(endpoint => req.url.includes(endpoint));

  let request = req;

  // Add Authorization header only for non-auth endpoints (login/register etc must not send an expired token)
  if (token && !isAuthEndpoint) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 Unauthorized and not an auth endpoint, try to refresh token
      if (error.status === 401 && !isAuthEndpoint) {
        return authService.refreshToken().pipe(
          switchMap((response: AuthResponse) => {
            // Retry original request with new token
            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`
              }
            });
            return next(newRequest);
          }),
          catchError((refreshError: unknown) => {
            // Refresh failed, logout is already handled in AuthService.refreshToken
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
