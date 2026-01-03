# TaskFlow Kanban - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Java 17+ installed
- PostgreSQL 16 running
- Git installed

## Backend Setup

1. **Start PostgreSQL Database**
   ```bash
   # Make sure PostgreSQL is running on port 5432
   # Database: taskflow_db
   # User: postgres
   # Password: root
   ```

2. **Run Backend Server**
   ```bash
   cd backend
   mvn spring-boot:run
   
   # Backend will start on http://localhost:8080
   # API available at http://localhost:8080/api
   # Swagger UI at http://localhost:8080/api/swagger-ui.html
   ```

## Frontend Setup

1. **Install Dependencies** (if not already done)
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   ng serve
   
   # Frontend will start on http://localhost:4200
   # Open browser to http://localhost:4200
   ```

## First Time Usage

### 1. Register a New Account
- Navigate to http://localhost:4200
- You'll be redirected to `/login`
- Click "Register" or go to `/register`
- Create a new account with:
  - Username
  - Email
  - Password

### 2. Login
- Enter your credentials
- You'll be redirected to `/boards`

### 3. Create Your First Workspace
- Click the workspace selector in the navbar
- Click "Manage Workspaces"
- Click "Create Workspace"
- Enter workspace name
- You'll see your new workspace selected

### 4. Create Your First Board
- On the Boards page, click "Create Board"
- Enter board name
- Click to open the board

### 5. Create Columns (Lists)
- Click "Add another list"
- Enter column title (e.g., "To Do", "In Progress", "Done")
- Click "Add Column"

### 6. Create Cards
- In any column, click "Add a card"
- Enter card title
- Click "Add Card"

### 7. Use Drag & Drop
- Drag cards within a column to reorder
- Drag cards between columns to move them
- Drag columns to reorder them

### 8. View Card Details
- Click any card to open the details modal
- Edit title, description
- Add comments
- View activity timeline

## Key Features to Try

### Navigation
- **Workspace Selector**: Switch between workspaces
- **Sidebar**: Access boards, members, activity, settings
- **Search**: Search for cards, boards (navbar center)
- **Quick Create**: Create boards/cards quickly (+ button in navbar)

### Board Management
- **Grid/List View**: Toggle view mode on boards page
- **Board Actions**: Edit, delete boards
- **Board Sharing**: Share boards with team members

### Card Management
- **Drag & Drop**: Reorder and move cards
- **Card Details**: Full card view with comments and activity
- **Due Dates**: Set card deadlines
- **Labels**: Color-code cards (UI ready, backend integration needed)
- **Assignees**: Assign team members to cards

### Activity Tracking
- **Activity View**: See all workspace activities
- **Card Timeline**: View card history in card details modal
- **Audit Trail**: Complete transparency of all changes

## Troubleshooting

### Backend Not Starting
- Check PostgreSQL is running
- Verify database exists: `taskflow_db`
- Check `application.yml` for correct database credentials
- Look for port conflicts (8080 already in use)

### Frontend Not Starting
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Check port 4200 is available

### CORS Errors
- Ensure backend CORS configuration allows `http://localhost:4200`
- Check `SecurityConfig.java` in backend

### 401 Unauthorized Errors
- Clear browser localStorage
- Logout and login again
- Check JWT token expiration in backend

### Drag & Drop Not Working
- Check browser console for errors
- Ensure @angular/cdk is installed
- Verify animations are enabled in app.config.ts

## Environment Configuration

### Development
- Frontend: `src/environments/environment.ts`
- Backend: `src/main/resources/application.yml`

### Production
- Frontend: `src/environments/environment.prod.ts`
- Backend: `src/main/resources/application-prod.yml` (if exists)

## API Testing

### Swagger UI
- URL: http://localhost:8080/api/swagger-ui.html
- Test all API endpoints
- View request/response schemas

### Postman Collection
- Import endpoints from Swagger
- Test authentication flow
- Verify API responses

## Building for Production

### Frontend
```bash
cd frontend
ng build --configuration production

# Output in: dist/frontend/browser
# Deploy to nginx, Apache, or CDN
```

### Backend
```bash
cd backend
mvn clean package

# JAR file in: target/taskflow-kanban-*.jar
# Run with: java -jar target/taskflow-kanban-*.jar
```

## Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Services:
# - PostgreSQL: 5432
# - Backend: 8080
# - Frontend: 80
```

## Default Ports

- **Frontend**: 4200 (dev), 80 (prod)
- **Backend**: 8080
- **PostgreSQL**: 5432
- **Swagger**: 8080/api/swagger-ui.html

## Useful Commands

### Frontend
```bash
# Development server
ng serve

# Build
ng build

# Run tests
ng test

# Lint
ng lint

# Generate component
ng generate component features/example/pages/example-page
```

### Backend
```bash
# Run application
mvn spring-boot:run

# Build JAR
mvn clean package

# Run tests
mvn test

# Skip tests
mvn clean package -DskipTests
```

## Browser DevTools Tips

### Network Tab
- Monitor API calls
- Check request/response payloads
- Verify JWT tokens in headers

### Console Tab
- Check for JavaScript errors
- View console logs
- Test API with fetch()

### Application Tab
- View localStorage (JWT token, workspace selection)
- Clear storage if needed
- Check IndexedDB if using offline mode

## Keyboard Shortcuts (Future)

Currently not implemented, but planned:
- `Ctrl/Cmd + K` - Quick search
- `C` - Create card
- `B` - Create board
- `Esc` - Close modals
- `Enter` - Submit forms

## Next Steps

1. **Explore All Features**
   - Try drag & drop
   - Create multiple boards
   - Add comments to cards
   - View activity timeline

2. **Customize**
   - Update color scheme in `_variables.scss`
   - Add custom board backgrounds
   - Implement additional features

3. **Deploy**
   - Set up production environment
   - Configure domain and SSL
   - Set up CI/CD pipeline

4. **Extend**
   - Add real-time WebSocket updates
   - Implement file uploads
   - Add email notifications
   - Create mobile app

## Support & Resources

- **Architecture**: See `ARCHITECTURE.md`
- **UI Components**: See `UI_COMPONENT_TREE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **API Docs**: http://localhost:8080/api/swagger-ui.html

## Common Issues & Solutions

### Issue: "Module not found" error
**Solution**: Run `npm install` in frontend directory

### Issue: Board columns not showing
**Solution**: Create columns first, then add cards

### Issue: Drag & drop not smooth
**Solution**: Close other browser tabs, check CPU usage

### Issue: Changes not persisting
**Solution**: Check backend logs, verify database connection

### Issue: Blank screen on load
**Solution**: Check browser console, verify backend is running

## Success Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 4200
- [ ] Database connected
- [ ] User registered and logged in
- [ ] Workspace created
- [ ] Board created
- [ ] Columns added
- [ ] Cards created
- [ ] Drag & drop working
- [ ] Card details modal opening
- [ ] Comments working
- [ ] Activity showing

Congratulations! You're ready to use TaskFlow Kanban. 🎉
