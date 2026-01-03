# TaskFlow UI Architecture

## Component Hierarchy

```
App Root
├── Top Navbar (Global, Sticky)
│   ├── Logo
│   ├── Workspace Selector
│   ├── Global Search
│   ├── Quick Create Button
│   ├── Notifications Icon
│   └── User Profile Menu
│
└── Main Layout
    ├── Left Sidebar (Workspace Navigation)
    │   ├── Workspace Info
    │   ├── Navigation Links
    │   └── Boards List (Favorites, Recent)
    │
    └── Main Content Area (Router Outlet)
        ├── Boards Overview Page
        │   └── Board Grid/List
        │       └── Board Card
        │
        ├── Board View (Kanban)
        │   ├── Board Header
        │   └── Columns Container (Horizontal Scroll)
        │       └── Column (List)
        │           ├── Column Header
        │           ├── Add Card Button
        │           └── Cards List (Drag & Drop)
        │               └── Card Item
        │
        ├── Card Details Modal
        │   ├── Card Header
        │   ├── Description Section
        │   ├── Activity Timeline
        │   ├── Comments Section
        │   ├── Sidebar
        │   │   ├── Assignees
        │   │   ├── Labels
        │   │   ├── Due Date
        │   │   └── Attachments
        │   └── Actions
        │
        ├── Activity View
        │   └── Activity Feed
        │       └── Activity Item
        │
        └── Settings Pages
            ├── Workspace Settings
            ├── Board Settings
            └── User Profile
```

## Page Routes

```
/login                          → Login Page
/register                       → Register Page
/boards                         → Boards Overview (default, protected)
/boards/:id                     → Board View (Kanban)
/workspaces                     → Workspace Management
/workspaces/:id                 → Workspace Details
/workspaces/:id/settings        → Workspace Settings
/workspaces/:id/members         → Workspace Members
/workspaces/:id/activity        → Workspace Activity
/profile                        → User Profile
/settings                       → User Settings
```

## Component Structure

### Feature Modules

```
frontend/src/app/
├── core/                           # Singleton services, global utilities
│   ├── models/                     # TypeScript interfaces (DTOs aligned with backend)
│   ├── services/                   # HTTP services for API calls
│   ├── interceptors/               # HTTP interceptors (auth, error, loading)
│   ├── guards/                     # Route guards
│   ├── pipes/                      # Custom pipes
│   └── utils/                      # Helper functions
│
├── shared/                         # Reusable presentational components
│   ├── components/
│   │   ├── navbar/                 # Top navigation bar
│   │   ├── sidebar/                # Left sidebar navigation
│   │   ├── user-avatar/            # User avatar with fallback
│   │   ├── icon/                   # Icon wrapper component
│   │   ├── button/                 # Button variants
│   │   ├── input/                  # Form input components
│   │   ├── dropdown/               # Dropdown menu
│   │   ├── modal/                  # Modal dialog
│   │   ├── loading-spinner/        # Loading states
│   │   ├── empty-state/            # Empty state templates
│   │   ├── error-state/            # Error state templates
│   │   ├── skeleton/               # Skeleton loaders
│   │   └── confirm-dialog/         # Confirmation dialogs
│   ├── directives/                 # Custom directives (clickOutside, etc.)
│   └── layouts/                    # Layout wrappers
│
├── features/                       # Feature-based modules
│   ├── auth/                       # Authentication
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   │
│   ├── board/                      # Board management
│   │   ├── pages/
│   │   │   ├── board-list/         # Boards overview
│   │   │   └── board-view/         # Kanban board view
│   │   ├── components/
│   │   │   ├── board-card/         # Board card in list
│   │   │   ├── board-header/       # Board title and actions
│   │   │   ├── board-column/       # Kanban column
│   │   │   ├── card-item/          # Card in column
│   │   │   ├── card-detail-modal/  # Full card details
│   │   │   ├── add-card-form/      # Quick add card
│   │   │   ├── add-column-form/    # Add new column
│   │   │   └── column-menu/        # Column actions menu
│   │   └── services/
│   │       └── board-state.service.ts  # Board state management
│   │
│   ├── workspace/                  # Workspace management
│   │   ├── pages/
│   │   │   ├── workspace-list/
│   │   │   ├── workspace-detail/
│   │   │   ├── workspace-settings/
│   │   │   └── workspace-members/
│   │   ├── components/
│   │   │   ├── workspace-selector/
│   │   │   ├── workspace-card/
│   │   │   └── member-list/
│   │   └── services/
│   │       └── workspace-state.service.ts
│   │
│   ├── activity/                   # Activity & Audit
│   │   ├── pages/
│   │   │   └── activity-view/
│   │   └── components/
│   │       ├── activity-feed/
│   │       └── activity-item/
│   │
│   └── user/                       # User profile & settings
│       ├── pages/
│       │   ├── profile/
│       │   └── settings/
│       └── components/
│           └── profile-form/
│
└── styles/                         # Global styles
    ├── _variables.scss             # SCSS variables
    ├── _typography.scss            # Font styles
    ├── _colors.scss                # Color palette
    ├── _mixins.scss                # SCSS mixins
    └── _utilities.scss             # Utility classes
```

## API Integration Points

### HTTP Services (Backend DTOs)

All services use strict TypeScript interfaces aligned with backend DTOs:

**WorkspaceService**
- `GET /api/workspaces` → List workspaces
- `POST /api/workspaces` → Create workspace
- `GET /api/workspaces/:id` → Get workspace details
- `PUT /api/workspaces/:id` → Update workspace
- `DELETE /api/workspaces/:id` → Delete workspace
- `POST /api/workspaces/:id/members/:userId` → Add member
- `DELETE /api/workspaces/:id/members/:userId` → Remove member

**BoardService**
- `GET /api/boards?workspaceId=:id` → List boards by workspace
- `POST /api/boards` → Create board
- `GET /api/boards/:id` → Get board with columns and cards
- `PUT /api/boards/:id` → Update board
- `DELETE /api/boards/:id` → Delete board
- `POST /api/boards/:id/members/:userId` → Add member
- `DELETE /api/boards/:id/members/:userId` → Remove member

**ColumnService**
- `GET /api/columns?boardId=:id` → List columns
- `POST /api/columns` → Create column
- `PUT /api/columns/:id` → Update column
- `DELETE /api/columns/:id` → Delete column
- `PUT /api/columns/:id/move` → Reorder column

**CardService**
- `GET /api/cards?columnId=:id` → List cards by column
- `POST /api/cards` → Create card
- `GET /api/cards/:id` → Get card details
- `PUT /api/cards/:id` → Update card
- `DELETE /api/cards/:id` → Delete card
- `PUT /api/cards/:id/move` → Move card (column + position)
- `POST /api/cards/:id/assignees/:userId` → Add assignee
- `DELETE /api/cards/:id/assignees/:userId` → Remove assignee

**CommentService**
- `GET /api/comments?cardId=:id` → List comments
- `POST /api/comments` → Create comment
- `PUT /api/comments/:id` → Update comment
- `DELETE /api/comments/:id` → Delete comment

**ActivityService**
- `GET /api/activity?entityId=:id&entityType=:type` → Get activity logs

**LabelService**
- `GET /api/labels?boardId=:id` → List labels
- `POST /api/labels` → Create label
- `PUT /api/labels/:id` → Update label
- `DELETE /api/labels/:id` → Delete label

**AttachmentService**
- `POST /api/attachments` → Upload attachment (multipart/form-data)
- `DELETE /api/attachments/:id` → Delete attachment

## State Management Strategy

### Approach: Service-based State Management

**Workspace State**
- Current workspace selection persisted in localStorage
- Workspace selector reloads scoped data on change
- Managed by `WorkspaceStateService`

**Board State**
- Board data (columns, cards) loaded on board view
- Optimistic updates for drag-and-drop
- Real-time sync with backend
- Managed by `BoardStateService`

**User State**
- Current user info from JWT
- Stored in `AuthService`

### Optimistic Updates

For drag-and-drop operations:
1. Update local state immediately (UI responsiveness)
2. Make API call in background
3. If API fails, revert to previous state + show error

## Drag & Drop Implementation

Using `@angular/cdk/drag-drop`:

**Card Drag & Drop**
- Within same column: Update positions
- Between columns: Move card + update positions
- API call: `PUT /api/cards/:id/move { targetColumnId, newPosition }`

**Column Reordering**
- Drag columns horizontally
- API call: `PUT /api/columns/:id/move { newPosition }`

## Design System

### Color Palette

```scss
// Primary
$primary-50: #e3f2fd;
$primary-100: #bbdefb;
$primary-500: #2196f3; // Main brand color
$primary-700: #1976d2;
$primary-900: #0d47a1;

// Neutral
$gray-50: #fafafa;
$gray-100: #f5f5f5;
$gray-200: #eeeeee;
$gray-300: #e0e0e0;
$gray-400: #bdbdbd;
$gray-500: #9e9e9e;
$gray-600: #757575;
$gray-700: #616161;
$gray-800: #424242;
$gray-900: #212121;

// Semantic
$success: #4caf50;
$warning: #ff9800;
$error: #f44336;
$info: #2196f3;

// Background
$bg-primary: #ffffff;
$bg-secondary: #f5f5f5;
$bg-tertiary: #eeeeee;
```

### Typography

```scss
$font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

// Font Sizes
$text-xs: 0.75rem;   // 12px
$text-sm: 0.875rem;  // 14px
$text-base: 1rem;    // 16px
$text-lg: 1.125rem;  // 18px
$text-xl: 1.25rem;   // 20px
$text-2xl: 1.5rem;   // 24px
$text-3xl: 1.875rem; // 30px

// Font Weights
$font-regular: 400;
$font-medium: 500;
$font-semibold: 600;
$font-bold: 700;
```

### Spacing Scale

```scss
$spacing-1: 0.25rem;  // 4px
$spacing-2: 0.5rem;   // 8px
$spacing-3: 0.75rem;  // 12px
$spacing-4: 1rem;     // 16px
$spacing-5: 1.25rem;  // 20px
$spacing-6: 1.5rem;   // 24px
$spacing-8: 2rem;     // 32px
$spacing-10: 2.5rem;  // 40px
$spacing-12: 3rem;    // 48px
```

### Elevation (Shadows)

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Responsive Breakpoints

```scss
$breakpoint-xs: 0;
$breakpoint-sm: 640px;   // Mobile landscape
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1280px;  // Large desktop
$breakpoint-2xl: 1536px; // Extra large
```

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators
- Screen reader support
- Contrast ratios WCAG AA compliant
- Alt text for all images/icons

## Icon Library

Using **Lucide Angular** (clean, consistent SVG icons)
- Install: `npm install lucide-angular`
- Tree-shakable, performant
- Example icons: Menu, Search, Bell, User, Plus, X, ChevronDown, etc.

## Performance Optimizations

1. **Lazy Loading**: All feature modules loaded on-demand
2. **OnPush Change Detection**: Dumb components use OnPush strategy
3. **Virtual Scrolling**: For long lists of cards/activities
4. **Debounced Search**: Search input debounced (300ms)
5. **Image Optimization**: Lazy loading images, srcset for responsive images
6. **Bundle Optimization**: Tree-shaking, code splitting

## Error Handling

- Global error interceptor catches API errors
- Toast notifications for user-facing errors
- Retry logic for failed API calls (3 retries with exponential backoff)
- Offline detection and graceful degradation

## Loading States

- Skeleton screens for initial page loads
- Inline spinners for actions (buttons, forms)
- Loading bar for navigation transitions
- Optimistic updates for instant feedback

## Empty States

Professional empty states with:
- Descriptive icon
- Clear message
- Call-to-action button
- Contextual help text

Examples:
- "No boards yet. Create your first board to get started."
- "This column is empty. Add a card to track your work."
- "No activity to show. Actions will appear here."
