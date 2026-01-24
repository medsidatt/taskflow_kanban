import { Component, Input } from '@angular/core';
import { LucideAngularModule, icons } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [name]="name" [size]="size" [color]="color" [strokeWidth]="strokeWidth" />`,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class IconComponent {
  @Input() name: keyof typeof icons = 'circle';
  @Input() size: number = 20;
  @Input() color?: string;
  @Input() strokeWidth: number = 2;
}
