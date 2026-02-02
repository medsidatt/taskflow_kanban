import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/services/auth.service';

/** Request is to login/register/etc.; do not redirect to login on auth errors. */
function isAuthEndpoint(url: string): boolean {
  if (!url) return false;
  return ['/auth/login', '/auth/register', '/auth/refresh', '/auth/verify', '/auth/forgot-password', '/auth/reset-password']
    .some(endpoint => url.includes(endpoint));
}

/**
 * Global error interceptor.
 * Redirects to login when session is invalid or backend is unavailable (e.g. DB deleted).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error.status ?? 0;
      const authReq = isAuthEndpoint(req.url);

      // Session invalid or backend down: clear session and go to login (except when already on auth endpoints)
      if (!authReq && (status === 401 || status === 0 || (status >= 500 && status < 600))) {
        authService.logout();
        const msg = status === 0
          ? 'Cannot reach server. Please try again.'
          : status === 401
            ? 'Unauthorized. Please login again.'
            : 'Server error. Please try again.';
        return throwError(() => new Error(msg));
      }

      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request: Invalid input';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            break;
          case 403:
            errorMessage = 'Forbidden. You do not have permission.';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict: Resource already exists';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation failed: Invalid input data';
            break;
          case 500:
            errorMessage = 'Internal Server Error. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error (${status}): ${error.statusText}`;
        }
      }

      if (!environment.production) {
        console.error('HTTP Error:', { status, statusText: error.statusText, message: errorMessage, url: req.url });
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};

