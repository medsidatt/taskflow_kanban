import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Loading interceptor
 * Shows/hides loading indicator for HTTP requests
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Skip loading for certain endpoints
  const skipLoading = req.url.includes('/health') || 
                      req.url.includes('/actuator') ||
                      req.headers.has('X-Skip-Loading');

  if (!skipLoading) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.hide();
      }
    })
  );
};
