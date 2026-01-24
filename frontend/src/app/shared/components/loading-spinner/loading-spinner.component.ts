import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../../core/services/loading.service';

/**
 * Loading Spinner Component
 * Displays a loading indicator when HTTP requests are in progress
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  template: `
    @if (loading()) {
      <div class="loading-overlay">
        <div class="spinner-container">
          <div class="spinner"></div>
          <p class="loading-text">Loading...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner-container {
      text-align: center;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      color: white;
      margin-top: 15px;
      font-size: 16px;
      font-weight: 500;
    }
  `]
})
export class LoadingSpinnerComponent {
  readonly loading: Signal<boolean>;

  constructor(loadingService: LoadingService) {
    this.loading = toSignal(loadingService.loading$, { initialValue: false });
  }
}
