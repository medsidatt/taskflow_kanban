import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Global error interceptor
 * Handles HTTP errors consistently across the application
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request: Invalid input';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            // Note: Token refresh is handled by auth interceptor
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
            // Validation error - common in auth endpoints
            errorMessage = error.error?.message || 'Validation failed: Invalid input data';
            break;
          case 500:
            errorMessage = 'Internal Server Error. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error (${error.status}): ${error.statusText}`;
        }
      }

      // Log error to console in development
      if (!environment.production) {
        console.error('HTTP Error:', {
          status: error.status,
          statusText: error.statusText,
          message: errorMessage,
          url: req.url
        });
      }

      // TODO: Send error to logging service for monitoring

      return throwError(() => new Error(errorMessage));
    })
  );
};

