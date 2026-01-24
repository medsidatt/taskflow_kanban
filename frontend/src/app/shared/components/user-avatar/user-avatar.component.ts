import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div 
      class="avatar" 
      [class.avatar-sm]="size === 'sm'"
      [class.avatar-lg]="size === 'lg'"
      [ngStyle]="{ 'background-color': backgroundColor, 'color': textColor }"
      [title]="name">
      @if (imageUrl) {
        <img [src]="imageUrl" [alt]="name" />
      } @else {
        <span>{{ initials }}</span>
      }
    </div>
  `
})
export class UserAvatarComponent {
  @Input() name: string = '';
  @Input() imageUrl?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() backgroundColor?: string;
  @Input() textColor?: string;

  get initials(): string {
    if (!this.name) return '?';
    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return this.name.substring(0, 2).toUpperCase();
  }
}
