# Frontend Development Quick Reference

**Last Updated**: January 18, 2026

---

## Authentication API Quick Reference

### Login
```typescript
import { AuthService } from '@app/features/auth/services/auth.service';

constructor(private authService: AuthService) {}

login(username: string, password: string): void {
  this.authService.login({
    usernameOrEmail: username,
    password: password
  }).subscribe({
    next: (response) => {
      console.log('Logged in:', response.user.username);
      // Navigate to dashboard
    },
    error: (error) => {
      console.error('Login failed:', error.message);
    }
  });
}
```

### Register
```typescript
register(username: string, email: string, password: string): void {
  this.authService.register({
    username,
    email,
    password
  }).subscribe({
    next: (response) => {
      console.log('Registered:', response.user.username);
      // Auto-login after register
    },
    error: (error) => {
      console.error('Registration failed:', error.message);
    }
  });
}
```

### Check Authentication
```typescript
// Check if user is authenticated
if (this.authService.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = this.authService.getCurrentUser();
console.log(user?.username);
```

### Logout
```typescript
logout(): void {
  this.authService.logout();
  // Redirects to /login automatically
}
```

### Email Verification
```typescript
verifyEmail(token: string): void {
  this.authService.verifyEmail({ token }).subscribe({
    next: (response) => {
      console.log('Email verified:', response);
    },
    error: (error) => {
      console.error('Verification failed:', error.message);
    }
  });
}
```

### Password Reset
```typescript
// Step 1: Request password reset
requestPasswordReset(email: string): void {
  this.authService.forgotPassword({ email }).subscribe({
    next: (response) => {
      console.log('Reset email sent:', response);
    }
  });
}

// Step 2: Complete password reset
resetPassword(email: string, newPassword: string): void {
  this.authService.resetPassword({
    email,
    newPassword
  }).subscribe({
    next: (response) => {
      console.log('Password reset successful:', response);
    }
  });
}
```

---

## Using Signals for Reactive UI

### Get Current User Signal
```typescript
export class AppComponent {
  private authService = inject(AuthService);
  
  // Access signal value
  currentUser = this.authService.currentUser;
  
  // In template
  // {{ currentUser()?.username }}
}
```

### Watch User Changes
```typescript
effect(() => {
  const user = this.authService.currentUser();
  if (user) {
    console.log('User logged in:', user.username);
  } else {
    console.log('User logged out');
  }
});
```

---

## Environment Configuration

### Development (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiVersion: 'v1'
};
```

### Production (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: '/api',  // Relative URL
  apiVersion: 'v1'
};
```

### Using Environment
```typescript
import { environment } from '@environments/environment';

// Use in service
private readonly apiUrl = `${environment.apiUrl}/users`;

// Check production mode
if (environment.production) {
  // Production-specific code
}
```

---

## Error Handling

### HTTP Error Status Codes
```typescript
// Automatically handled by error interceptor:

400 - Bad Request (validation error)
  → errorMessage: "Bad Request: Invalid input"

401 - Unauthorized (token expired)
  → errorMessage: "Unauthorized. Please login again."
  → Automatic token refresh attempted

403 - Forbidden (permission denied)
  → errorMessage: "Forbidden. You do not have permission."

404 - Not Found
  → errorMessage: "Resource not found"

409 - Conflict (resource already exists)
  → errorMessage: "Conflict: Resource already exists"

422 - Validation Error
  → errorMessage: "Validation failed: Invalid input data"

500 - Server Error
  → errorMessage: "Internal Server Error. Please try again later."
```

### Catching Errors
```typescript
this.authService.login(credentials).subscribe({
  next: (response) => {
    // Success
  },
  error: (error) => {
    // error is an Error object
    console.log(error.message); // Pre-formatted error message
  }
});
```

---

## HTTP Interceptors

### Interceptor Chain Order
```
1. loadingInterceptor   - Show/hide loading spinner
2. authInterceptor      - Add Authorization header, handle 401
3. errorInterceptor     - Format error messages
```

### Auto-Attached Authorization Header
```typescript
// All requests automatically include:
Authorization: Bearer <access_token>

// Except:
- /auth/login
- /auth/register
- /auth/refresh
- /auth/verify
- /auth/forgot-password
- /auth/reset-password
```

### Token Refresh
```typescript
// Automatic when receiving 401 Unauthorized:

1. authInterceptor detects 401
2. Calls AuthService.refreshToken()
3. Gets new access token
4. Retries original request with new token
5. If refresh fails → logout and redirect to /login
```

---

## Route Guards

### Auth Guard
```typescript
// Protect routes that require authentication

import { authGuard } from '@app/features/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'board',
    component: BoardComponent,
    canActivate: [authGuard]  // Only authenticated users
  },
  {
    path: 'login',
    component: LoginComponent
    // No guard needed
  }
];
```

---

## Models & Types

### Authentication Models
```typescript
// Login request
interface LoginRequest {
  usernameOrEmail: string;  // Username or email
  password: string;
}

// Register request
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Auth response (received from backend)
interface AuthResponse {
  accessToken: string;       // JWT token
  refreshToken: string;      // For token refresh
  user: User;               // User information
}

// User model
interface User {
  id: string;               // UUID
  username: string;
  email: string;
  active?: boolean;
  lastLogin?: string;       // ISO 8601 timestamp
  roles?: Role[];
}
```

---

## Best Practices

### ✅ DO
- ✅ Use `environment.apiUrl` for all API calls
- ✅ Use `AuthService` for authentication operations
- ✅ Use route guards to protect pages
- ✅ Implement `ngOnDestroy` to unsubscribe from observables
- ✅ Use `takeUntil()` pattern for subscription cleanup
- ✅ Handle errors in subscribe callback
- ✅ Log errors for debugging in development

### ❌ DON'T
- ❌ Hardcode API URLs
- ❌ Store tokens in sessionStorage (use localStorage)
- ❌ Log password fields or sensitive data
- ❌ Forget to unsubscribe from observables
- ❌ Use `any` type (use strict TypeScript)
- ❌ Ignore error responses
- ❌ Store sensitive data in localStorage (only tokens)

---

## Common Patterns

### Unsubscribe Pattern
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({...})
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => { ... }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Using Signals
```typescript
import { Component, effect, inject } from '@angular/core';
import { AuthService } from '@app/features/auth/services/auth.service';

@Component({...})
export class MyComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  constructor() {
    // Watch for user changes
    effect(() => {
      if (this.currentUser()) {
        console.log('User logged in');
      } else {
        console.log('User logged out');
      }
    });
  }
}
```

### Error Handling Pattern
```typescript
login(username: string, password: string): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login({
    usernameOrEmail: username,
    password
  }).subscribe({
    next: (response) => {
      this.isLoading = false;
      // Navigate to dashboard
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.message;
      // Display error to user
    }
  });
}
```

---

## Debugging

### Enable Request/Response Logging
```typescript
// In development mode, all HTTP requests are logged
// Check browser console for HTTP errors

// AuthService.refreshToken() automatically attempts:
1. Extract refresh token from localStorage
2. POST to /api/auth/refresh
3. Store new tokens if successful
4. Logout if refresh fails

// Error interceptor logs:
- HTTP status code
- Request URL
- Error message
- Formatted for readability
```

### Check Token Expiration
```typescript
// Tokens have ~1 hour expiration on backend
// Frontend automatically refreshes on 401 response

// Check token in localStorage
const token = localStorage.getItem('access_token');
console.log(token);

// Check current user
const user = localStorage.getItem('user');
console.log(JSON.parse(user));
```

---

## API Endpoint Reference

### Authentication Endpoints
```
POST   /api/auth/login
  Request:  { login: "user@example.com", password: "pass" }
  Response: { accessToken, refreshToken, user }

POST   /api/auth/register
  Request:  { username, email, password }
  Response: { accessToken, refreshToken, user }

POST   /api/auth/refresh
  Request:  { refreshToken }
  Response: { accessToken, refreshToken, user }

POST   /api/auth/logout
  Request:  (empty)
  Response: (empty, 204 No Content)

GET    /api/auth/verify?token=X
  Request:  (token in query param)
  Response: "Email verified successfully"

POST   /api/auth/forgot-password?email=X
  Request:  (email in query param)
  Response: "Password reset email sent"

POST   /api/auth/reset-password
  Request:  { email, newPassword }
  Response: "Password reset successfully"
```

### User Endpoints
```
GET    /api/users/me
  Request:  (empty)
  Response: { id, username, email, active, lastLogin, roles }

PUT    /api/users/me
  Request:  { username?, email? }
  Response: { id, username, email, active, lastLogin, roles }

GET    /api/users
  Request:  (empty)
  Response: [{ id, username, email, ... }, ...]

GET    /api/users/:id
  Request:  (empty)
  Response: { id, username, email, active, lastLogin, roles }
```

---

## Support & Documentation

### Related Documentation
- `BACKEND_ANALYSIS_AND_FRONTEND_UPGRADES.md` - Full analysis and architecture
- `FRONTEND_UPGRADE_COMPLETE.md` - Upgrade completion report
- `ARCHITECTURE.md` - Overall system architecture
- `BACKEND-FRONTEND-MAPPING.md` - API contract mapping

### Key Files
- Auth Service: `frontend/src/app/features/auth/services/auth.service.ts`
- Auth Models: `frontend/src/app/core/models/auth.models.ts`
- Auth Interceptor: `frontend/src/app/features/auth/interceptors/auth.interceptor.ts`
- Error Interceptor: `frontend/src/app/core/interceptors/error.interceptor.ts`
- User Service: `frontend/src/app/core/services/user.service.ts`

---

**For questions or issues, refer to the comprehensive documentation in the workspace root directory.**
