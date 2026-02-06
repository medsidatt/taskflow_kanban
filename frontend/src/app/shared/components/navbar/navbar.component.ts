import { Component, OnInit, OnDestroy, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Search, Plus, Bell, User, LogOut, Settings, MoreVertical, Star, Check } from 'lucide-angular';
import { AuthService } from '../../../features/auth/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { SearchModalComponent } from '../../../features/search/components/search-modal/search-modal.component';
import { RelativeTimePipe } from '../../../core/pipes/relative-time.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    UserAvatarComponent,
    SearchModalComponent,
    RelativeTimePipe
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  readonly icons = { Search, Plus, Bell, User, LogOut, Settings, MoreVertical, Star, Check };

  @ViewChild(SearchModalComponent) searchModal!: SearchModalComponent;

  showQuickCreateDropdown = signal(false);
  showNotificationsDropdown = signal(false);
  showProfileDropdown = signal(false);

  currentUser = signal<any>(null);

  // Expose notification service signals to template
  get notifications() {
    return this.notificationService.recentNotifications;
  }

  get unreadCount() {
    return this.notificationService.unreadCount;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    // Initialize notifications if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.notificationService.initialize();
    }
  }

  ngOnDestroy(): void {
    this.notificationService.disconnect();
  }

  private loadCurrentUser(): void {
    // getCurrentUser() returns a signal, not an Observable
    const user = this.authService.getCurrentUser();
    this.currentUser.set(user);
  }

  openSearchModal(): void {
    this.searchModal.open();
  }

  createBoard(): void {
    this.showQuickCreateDropdown.set(false);
    this.router.navigate(['/boards', 'new']);
  }

  createCard(): void {
    this.showQuickCreateDropdown.set(false);
    // Open card creation modal
    console.log('Open card creation modal');
  }

  logout(): void {
    this.notificationService.clear();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onNotificationClick(notification: any): void {
    // Mark as read
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
    
    // Navigate to the entity if available
    if (notification.entityId && notification.entityType) {
      this.showNotificationsDropdown.set(false);
      // Navigate based on entity type
      switch (notification.entityType) {
        case 'Card':
          // Cards are accessed via their board, but for now just close dropdown
          // Could implement deep linking if needed
          break;
        case 'Board':
          this.router.navigate(['/boards', notification.entityId]);
          break;
        case 'Workspace':
          this.router.navigate(['/workspaces', notification.entityId]);
          break;
      }
    }
  }

  markAllNotificationsAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  navigateToProfile(): void {
    this.showProfileDropdown.set(false);
    this.router.navigate(['/profile']);
  }

  navigateToSettings(): void {
    this.showProfileDropdown.set(false);
    this.router.navigate(['/settings']);
  }

  toggleDropdown(dropdown: 'quickCreate' | 'notifications' | 'profile'): void {
    this.showQuickCreateDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showProfileDropdown.set(false);

    switch (dropdown) {
      case 'quickCreate':
        this.showQuickCreateDropdown.set(true);
        break;
      case 'notifications':
        this.showNotificationsDropdown.set(true);
        break;
      case 'profile':
        this.showProfileDropdown.set(true);
        break;
    }
  }

  closeAllDropdowns(): void {
    this.showQuickCreateDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.showProfileDropdown.set(false);
  }
}
