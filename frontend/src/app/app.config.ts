import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  BrowserPlatformLocation,
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PlatformLocation
} from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  LucideAngularModule,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  CreditCard,
  Users,
  Activity,
  Settings,
  Plus,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Archive,
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  ChevronUp,
  LogOut,
  X,
  AlignLeft,
  MessageSquare,
  Paperclip,
  Tag,
  Calendar,
  Briefcase,
  Inbox,
  Home,
  MoreHorizontal,
  Copy,
  Sun,
  Moon,
  Monitor,
  GripVertical,
  Share2
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Override Location stack: @angular/common defaults use inject() in factories, which
    // runs outside a valid injection context during Angular 20 bootstrap (effect scheduler).
    // These deps-based overrides avoid that. See NG0203_WHEN_IT_STARTED.md.
    {
      provide: PlatformLocation,
      useFactory: (b: BrowserPlatformLocation) => b,
      deps: [BrowserPlatformLocation]
    },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: Location,
      useFactory: (locationStrategy: LocationStrategy) => new Location(locationStrategy),
      deps: [LocationStrategy]
    },
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        authInterceptor,
        errorInterceptor
      ])
    ),

    // ✅ Icons
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        LayoutGrid,
        LayoutList,
        CreditCard,
        Users,
        Activity,
        Settings,
        Plus,
        Star,
        Clock,
        ChevronLeft,
        ChevronRight,
        Grid,
        List,
        Archive,
        MoreVertical,
        Edit2,
        Trash2,
        Filter,
        Menu,
        Search,
        Bell,
        User,
        ChevronDown,
        ChevronUp,
        LogOut,
        X,
        AlignLeft,
        MessageSquare,
        Paperclip,
        Tag,
        Calendar,
        Briefcase,
        Inbox,
        Home,
        MoreHorizontal,
        Copy,
        Sun,
        Moon,
        Monitor,
        GripVertical,
        Share2
      })
    )
  ]
};
