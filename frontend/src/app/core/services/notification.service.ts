import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification, UnreadCountResponse } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private readonly API_URL = `${environment.apiUrl}/notifications`;
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  // Reactive state
  private _notifications = signal<Notification[]>([]);
  private _unreadCount = signal<number>(0);
  private _connected = signal<boolean>(false);

  // Public read-only signals
  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();
  readonly connected = this._connected.asReadonly();

  // Computed: recent notifications (top 5 for dropdown)
  readonly recentNotifications = computed(() => this._notifications().slice(0, 5));

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.disconnect();
  }

  /**
   * Initialize the notification service - fetch initial data and connect SSE.
   */
  initialize(): void {
    this.fetchNotifications();
    this.fetchUnreadCount();
    this.connect();
  }

  /**
   * Connect to the SSE stream for real-time notifications.
   */
  connect(): void {
    if (this.eventSource) {
      return; // Already connected
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No access token available for SSE connection');
      return;
    }

    // EventSource doesn't support custom headers, so we pass token as query param
    const streamUrl = `${this.API_URL}/stream?token=${encodeURIComponent(token)}`;
    
    this.eventSource = new EventSource(streamUrl);

    this.eventSource.onopen = () => {
      console.debug('SSE connection established');
      this._connected.set(true);
      this.reconnectAttempts = 0;
    };

    this.eventSource.addEventListener('connected', (event) => {
      console.debug('SSE connected event:', event.data);
    });

    this.eventSource.addEventListener('notification', (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        // Add new notification to the beginning of the list
        this._notifications.update(notifications => [notification, ...notifications]);
        this._unreadCount.update(count => count + 1);
      } catch (error) {
        console.error('Failed to parse notification:', error);
      }
    });

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this._connected.set(false);
      this.eventSource?.close();
      this.eventSource = null;

      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.debug(`Attempting SSE reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        setTimeout(() => this.connect(), this.reconnectDelay);
      }
    };
  }

  /**
   * Disconnect from the SSE stream.
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this._connected.set(false);
    }
    this.reconnectAttempts = 0;
  }

  /**
   * Fetch all notifications from the server.
   */
  fetchNotifications(): void {
    this.http.get<Notification[]>(this.API_URL).subscribe({
      next: (notifications) => {
        this._notifications.set(notifications);
      },
      error: (error) => {
        console.error('Failed to fetch notifications:', error);
      }
    });
  }

  /**
   * Fetch unread count from the server.
   */
  fetchUnreadCount(): void {
    this.http.get<UnreadCountResponse>(`${this.API_URL}/unread-count`).subscribe({
      next: (response) => {
        this._unreadCount.set(response.count);
      },
      error: (error) => {
        console.error('Failed to fetch unread count:', error);
      }
    });
  }

  /**
   * Mark a specific notification as read.
   */
  markAsRead(notificationId: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${notificationId}/read`, {}).pipe(
      tap(() => {
        // Update local state
        this._notifications.update(notifications =>
          notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        this._unreadCount.update(count => Math.max(0, count - 1));
      })
    );
  }

  /**
   * Mark all notifications as read.
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/read-all`, {}).pipe(
      tap(() => {
        // Update local state
        this._notifications.update(notifications =>
          notifications.map(n => ({ ...n, isRead: true }))
        );
        this._unreadCount.set(0);
      })
    );
  }

  /**
   * Clear all notifications from local state (for logout).
   */
  clear(): void {
    this._notifications.set([]);
    this._unreadCount.set(0);
    this.disconnect();
  }
}
