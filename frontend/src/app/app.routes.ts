import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/boards',
    pathMatch: 'full'
  },

  // Auth routes (no layout)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
  },

  // Protected routes with main layout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'boards',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/board/pages/board-list/board-list.component').then(m => m.BoardListComponent)
          },
          {
            path: 'shared',
            loadComponent: () => import('./features/board/pages/shared-boards/shared-boards.component').then(m => m.SharedBoardsComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/board/pages/board-view/board-view.component').then(m => m.BoardViewComponent)
          }
        ]
      },
      {
        path: 'workspaces',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/workspace/pages/workspace-list/workspace-list.component').then(m => m.WorkspaceListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/workspace/workspace.component').then(m => m.WorkspaceComponent),
            children: [
              {
                path: '',
                loadComponent: () => import('./features/workspace/pages/workspace-detail/workspace-detail.component').then(m => m.WorkspaceDetailComponent)
              },
              {
                path: 'members',
                loadComponent: () => import('./features/workspace/pages/workspace-members/workspace-members.component').then(m => m.WorkspaceMembersComponent)
              },
              {
                path: 'settings',
                loadComponent: () => import('./features/workspace/pages/workspace-settings/workspace-settings.component').then(m => m.WorkspaceSettingsComponent)
              },
              {
                path: 'activity',
                loadComponent: () => import('./features/activity/pages/activity-view/activity-view.component').then(m => m.ActivityViewComponent)
              }
            ]
          }
        ]
      },
      {
        path: 'activity',
        loadComponent: () => import('./features/activity/pages/activity-view/activity-view.component').then(m => m.ActivityViewComponent)
      },
      {
        path: 'personal',
        children: [
          {
            path: 'cards',
            loadComponent: () => import('./features/personal/pages/personal-cards/personal-cards.component').then(m => m.PersonalCardsComponent)
          },
          {
            path: 'activity',
            loadComponent: () => import('./features/personal/pages/personal-activity/personal-activity.component').then(m => m.PersonalActivityComponent)
          }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/user/pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: 'tests',
    loadComponent: () => import('./features/test/test.component').then(m => m.TestComponent)
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/boards'
  }
];
