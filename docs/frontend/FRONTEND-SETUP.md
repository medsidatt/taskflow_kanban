# Frontend Setup Guide

Complete guide to setting up and running the TaskFlow Kanban frontend.

## 📋 Prerequisites

- Node.js 20+ installed
- npm 10+ installed
- Backend API running (see backend README)

## 🚀 Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:4200`

## 📦 Installation Steps

### 1. Install Node Dependencies

```bash
npm install
```

This will install all required packages including:
- Angular 19 framework
- Angular CDK for drag & drop
- RxJS for reactive programming
- TypeScript compiler

### 2. Configure Environment

The application uses environment files for configuration:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiVersion: 'v1'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: '/api',  // Uses relative path for reverse proxy
  apiVersion: 'v1'
};
```

### 3. Run Development Server

```bash
npm start
```

Features:
- Hot reload on file changes
- Source maps for debugging
- Development mode optimizations

### 4. Build for Production

```bash
npm run build --configuration=production
```

Output: `dist/frontend/browser/` - ready for deployment

## 🎨 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/              # Singleton services & core functionality
│   │   ├── features/          # Feature modules (auth, board, workspace)
│   │   ├── shared/            # Reusable components, pipes, directives
│   │   ├── app.component.*    # Root component
│   │   ├── app.config.ts      # App configuration
│   │   └── app.routes.ts      # Routing configuration
│   │
│   ├── environments/          # Environment configurations
│   ├── assets/                # Static assets (images, fonts, etc.)
│   ├── styles.css             # Global styles
│   ├── index.html             # Main HTML file
│   └── main.ts                # Application entry point
│
├── public/                    # Public assets
├── angular.json               # Angular CLI configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── Dockerfile                 # Docker build configuration
└── nginx.conf                 # Nginx configuration for production
```

## 🔧 Available Scripts

```bash
# Development
npm start              # Start dev server with hot reload
npm run watch          # Build and watch for changes

# Building
npm run build          # Development build
npm run build --configuration=production  # Production build

# Testing
npm test               # Run unit tests
npm run test:coverage  # Run tests with coverage report

# Linting
npm run lint           # Lint TypeScript files
npm run lint:fix       # Lint and auto-fix issues
```

## 🎯 Key Features

### Drag & Drop
Uses Angular CDK for drag and drop functionality:
```typescript
import { DragDropModule } from '@angular/cdk/drag-drop';
```

### HTTP Interceptors
Chain of interceptors:
1. **Loading Interceptor**: Shows/hides loading spinner
2. **Auth Interceptor**: Adds JWT token to requests
3. **Error Interceptor**: Handles HTTP errors globally

### Route Guards
Protected routes using `authGuard`:
```typescript
{
  path: 'boards',
  canActivate: [authGuard],
  loadComponent: () => import('./features/board/...')
}
```

### Lazy Loading
All feature modules are lazy loaded for optimal performance:
```typescript
loadComponent: () => import('./features/board/pages/board-list/board-list.component')
  .then(m => m.BoardListComponent)
```

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT tokens (access + refresh)
3. Tokens stored in localStorage
4. Auth interceptor adds token to all API requests
5. Auth guard protects routes
6. Auto-refresh on 401 response

## 🎨 Styling Architecture

### Global Styles (`styles.css`)
- CSS variables for theming
- Utility classes
- Base component styles
- Responsive breakpoints

### Component Styles
- Scoped to components
- Use CSS variables for consistency
- BEM naming convention (optional)

### Design Tokens
```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --success: #43e97b;
  /* ... more tokens ... */
}
```

## 📱 Responsive Design

Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Development Tips

### Angular DevTools
Install [Angular DevTools](https://angular.io/guide/devtools) Chrome extension for:
- Component tree inspection
- Change detection profiling
- Dependency injection tree

### Hot Module Replacement
Development server supports HMR:
- Changes reflect instantly
- State preserved when possible
- Fast development cycle

### Source Maps
Enabled in development for debugging:
```json
{
  "sourceMap": true
}
```

### Memory Leaks Prevention
Always unsubscribe from observables:
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe();
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## 🚢 Production Deployment

### Docker Build

```bash
# Build Docker image
docker build -t taskflow-frontend .

# Run container
docker run -p 80:80 taskflow-frontend
```

### Manual Deployment

```bash
# Build for production
npm run build --configuration=production

# Copy dist/ contents to web server
cp -r dist/frontend/browser/* /var/www/html/
```

### Environment Variables

For production, configure:
- API URL (via environment.prod.ts or runtime config)
- Enable production mode
- Disable source maps
- Enable AOT compilation

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Change port in angular.json or use:
ng serve --port 4201
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
# Clear Angular cache
rm -rf .angular/cache
npm run build
```

### Styles Not Loading
```bash
# Check that styles.css is referenced in angular.json
# Clear browser cache
# Hard refresh (Ctrl+Shift+R)
```

## 📚 Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular CDK](https://material.angular.io/cdk)
- [RxJS](https://rxjs.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT - See [LICENSE](../LICENSE)

---

**Need help?** Open an issue on GitHub or check the main README.
