# TaskFlow Kanban - Frontend

Modern Angular 19 application for Kanban board management.

## 🎨 Features

### Kanban Board
- **Drag & Drop**: Move cards between columns and reorder cards within columns
- **Multiple Boards**: Create and manage multiple Kanban boards
- **Columns**: Organize cards in customizable columns (TODO, In Progress, Done, etc.)
- **Cards**: Rich card interface with:
  - Title and description
  - Labels with custom colors
  - Due dates with visual indicators
  - Priority levels (High, Medium, Low)
  - Attachments
  - Comments
  - Team members
  - Activity tracking

### User Experience
- **Real-time Updates**: Instant feedback on all actions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradients, smooth animations, and intuitive interactions
- **Loading States**: Elegant loading indicators
- **Error Handling**: User-friendly error messages

## 🏗️ Architecture

```
src/app/
├── core/                     # Singleton services & core functionality
│   ├── constants/           # API endpoints, storage keys
│   ├── interceptors/        # HTTP interceptors (auth, error, loading)
│   ├── models/              # TypeScript interfaces
│   ├── pipes/               # Custom pipes (relativeTime, truncate)
│   ├── services/            # Core services (auth, board, user, etc.)
│   ├── utils/               # Utility functions
│   └── validators/          # Custom form validators
│
├── features/                # Feature modules
│   ├── auth/               # Authentication
│   │   ├── guards/         # Auth guard
│   │   ├── interceptors/   # Auth interceptor
│   │   ├── pages/          # Login, Register
│   │   └── services/       # Auth service
│   │
│   ├── board/              # Board management
│   │   ├── components/     # Column, Card, Card Detail Modal
│   │   └── pages/          # Board List, Board View
│   │
│   ├── dashboard/          # Dashboard
│   └── workspace/          # Workspace management
│
└── shared/                 # Reusable components
    ├── components/         # Navbar, Loading Spinner, etc.
    ├── directives/         # Custom directives
    └── pipes/              # Shared pipes
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser at
http://localhost:4200
```

### Build

```bash
# Development build
npm run build

# Production build
npm run build --configuration=production
```

## 📦 Key Dependencies

- **@angular/cdk**: Drag & drop functionality
- **@angular/material**: Material Design components
- **RxJS**: Reactive programming

## 🎯 Components

### Board View
Main Kanban board interface with drag-and-drop functionality.

**Features:**
- Horizontal scrolling for multiple columns
- Drag cards between columns
- Reorder columns
- Add new columns
- Board settings

### Board Column
Individual column component.

**Features:**
- Column header with card count
- Add new cards
- Drag and drop cards
- Column menu

### Board Card
Individual card component with rich metadata.

**Features:**
- Labels
- Due dates with status indicators
- Priority badges
- Attachment count
- Comment count
- Team members avatars
- Quick actions on hover

### Card Detail Modal
Full card view and editing interface.

**Features:**
- Tabbed interface (Details, Activity, Attachments)
- Edit mode for card details
- Activity log
- Comments section
- Attachment management
- Sidebar actions

### Board List
Grid view of all boards.

**Features:**
- Beautiful card grid with gradients
- Board statistics
- Create new board
- Delete boards

## 🎨 Styling

### Design System

**Colors:**
- Primary: `#667eea` (Purple)
- Secondary: Various gradients
- Success: `#43e97b` (Green)
- Warning: `#f39c12` (Orange)
- Danger: `#e74c3c` (Red)

**Typography:**
- Font Family: System fonts
- Headings: 700-800 weight
- Body: 400-600 weight

**Shadows:**
- Light: `0 2px 8px rgba(0, 0, 0, 0.1)`
- Medium: `0 4px 20px rgba(0, 0, 0, 0.1)`
- Heavy: `0 8px 32px rgba(0, 0, 0, 0.2)`

**Animations:**
- Duration: 0.3s
- Easing: ease, cubic-bezier

## 🔧 Development

### Code Style
- Use TypeScript strict mode
- Follow Angular style guide
- Use standalone components
- Implement OnDestroy for subscriptions
- Use reactive forms

### Component Structure
```typescript
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit, OnDestroy {
  // Component logic
}
```

### Service Pattern
```typescript
@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  constructor(private http: HttpClient) {}
  
  getData(): Observable<Data> {
    return this.http.get<Data>('/api/data');
  }
}
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔌 API Integration

The frontend communicates with the backend API using:
- HTTP interceptors for auth tokens
- Environment-based API URLs
- Type-safe models
- Error handling

### API Endpoints
See `src/app/core/constants/api.constants.ts` for all endpoints.

## 🐛 Troubleshooting

### Common Issues

**Issue: Module not found**
```bash
npm install
```

**Issue: Drag & drop not working**
```bash
# Ensure @angular/cdk is installed
npm install @angular/cdk
```

**Issue: Styles not loading**
```bash
# Clear Angular cache
rm -rf .angular/cache
ng serve
```

## 📚 Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular CDK](https://material.angular.io/cdk)
- [RxJS Documentation](https://rxjs.dev/)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the root directory.

## 📄 License

MIT License - see [LICENSE](../LICENSE)

---

**Built with ❤️ using Angular 19**
