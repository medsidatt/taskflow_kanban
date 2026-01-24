import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="main-layout">
      <app-navbar />
      <div class="layout-container">
        <app-sidebar />
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .layout-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background-color: var(--bg-secondary, #f5f5f5);
    }
  `]
})
export class MainLayoutComponent {}
