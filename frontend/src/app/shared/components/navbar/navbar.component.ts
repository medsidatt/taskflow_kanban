import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Search, Plus, Bell, User, LogOut, Settings, MoreVertical, Star } from 'lucide-angular';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { SearchModalComponent } from '../../../features/search/components/search-modal/search-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    UserAvatarComponent,
    SearchModalComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  readonly icons = { Search, Plus, Bell, User, LogOut, Settings, MoreVertical, Star };

  @ViewChild(SearchModalComponent) searchModal!: SearchModalComponent;

  showQuickCreateDropdown = signal(false);
  showNotificationsDropdown = signal(false);
  showProfileDropdown = signal(false);

  currentUser = signal<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
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
    this.authService.logout();
    this.router.navigate(['/login']);
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
