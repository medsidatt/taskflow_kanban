import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, User, Lock, Settings } from 'lucide-angular';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, UserAvatarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  readonly icons = { User, Lock, Settings };

  loading = signal(true);
  saving = signal(false);
  changingPassword = signal(false);

  formUsername = signal('');
  formEmail = signal('');
  initialUsername = signal('');
  initialEmail = signal('');

  passwordOld = signal('');
  passwordNew = signal('');
  passwordConfirm = signal('');

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (u) => {
        const un = u?.username ?? '';
        const em = u?.email ?? '';
        this.formUsername.set(un);
        this.formEmail.set(em);
        this.initialUsername.set(un);
        this.initialEmail.set(em);
      },
      error: () => this.toast.error('Failed to load profile'),
      complete: () => this.loading.set(false)
    });
  }

  save(): void {
    const u = this.formUsername().trim();
    const e = this.formEmail().trim();
    if (!u || !e) {
      this.toast.error('Username and email are required');
      return;
    }
    const patch: { username?: string; email?: string } = {};
    if (u !== this.initialUsername()) patch.username = u;
    if (e !== this.initialEmail()) patch.email = e;
    if (Object.keys(patch).length === 0) {
      this.toast.info('No changes to save');
      return;
    }
    this.saving.set(true);
    this.userService.updateProfile(patch).subscribe({
      next: (updated) => {
        this.initialUsername.set(updated?.username ?? u);
        this.initialEmail.set(updated?.email ?? e);
        this.authService.currentUser.set({ ...this.authService.currentUser(), ...updated });
        this.toast.success('Profile updated');
      },
      error: (err) => {
        const ev = err?.error?.validationErrors;
        if (ev && typeof ev === 'object') {
          const first = Object.values(ev)[0];
          if (typeof first === 'string') {
            this.toast.error(first);
            return;
          }
        }
        const msg = err?.error?.message || err?.error || 'Failed to update profile';
        this.toast.error(typeof msg === 'string' ? msg : 'Failed to update profile');
      },
      complete: () => this.saving.set(false)
    });
  }

  changePassword(): void {
    const old = this.passwordOld();
    const newP = this.passwordNew();
    const confirm = this.passwordConfirm();
    if (!old || !newP) {
      this.toast.error('Enter current and new password');
      return;
    }
    if (newP.length < 6) {
      this.toast.error('New password must be at least 6 characters');
      return;
    }
    if (newP !== confirm) {
      this.toast.error('New passwords do not match');
      return;
    }
    this.changingPassword.set(true);
    this.userService.changePassword(old, newP).subscribe({
      next: () => {
        this.passwordOld.set('');
        this.passwordNew.set('');
        this.passwordConfirm.set('');
        this.toast.success('Password changed');
      },
      error: (err) => {
        const ev = err?.error?.validationErrors;
        if (ev && typeof ev === 'object') {
          const first = Object.values(ev)[0];
          if (typeof first === 'string') {
            this.toast.error(first);
            return;
          }
        }
        const msg = err?.error?.message || err?.error || 'Failed to change password';
        this.toast.error(typeof msg === 'string' ? msg : 'Failed to change password');
      },
      complete: () => this.changingPassword.set(false)
    });
  }
}
