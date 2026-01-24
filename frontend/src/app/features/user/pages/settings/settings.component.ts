import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Sun, Moon, Monitor, User, Bell } from 'lucide-angular';
import { ThemeService, ThemeMode } from '../../../../core/services/theme.service';

const KEY_NOTIFY_ASSIGNED = 'taskflow-notify-email-assigned';
const KEY_NOTIFY_DIGEST = 'taskflow-notify-email-digest';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  readonly icons = { Sun, Moon, Monitor, User, Bell };

  notifyEmailAssigned = true;
  notifyEmailDigest = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.notifyEmailAssigned = localStorage.getItem(KEY_NOTIFY_ASSIGNED) !== 'false';
    this.notifyEmailDigest = localStorage.getItem(KEY_NOTIFY_DIGEST) === 'true';
  }

  setTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
  }

  toggleNotifyAssigned(): void {
    this.notifyEmailAssigned = !this.notifyEmailAssigned;
    localStorage.setItem(KEY_NOTIFY_ASSIGNED, String(this.notifyEmailAssigned));
  }

  toggleNotifyDigest(): void {
    this.notifyEmailDigest = !this.notifyEmailDigest;
    localStorage.setItem(KEY_NOTIFY_DIGEST, String(this.notifyEmailDigest));
  }
}
