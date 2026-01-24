import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Loading Service
 * Manages global loading state for the application
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  /**
   * Observable to subscribe to loading state changes
   */
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Show loading indicator
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Hide loading indicator
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }

  /**
   * Force hide loading indicator
   */
  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Get current loading state
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
