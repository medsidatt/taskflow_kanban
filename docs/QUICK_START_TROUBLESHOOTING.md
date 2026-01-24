# 🚀 TaskFlow Kanban - Quick Start & Troubleshooting

**Date**: January 20, 2026

---

## Getting Started

### 1. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
mvn clean install
```

### 2. Start Development Environment

#### Terminal 1 - Backend
```bash
cd backend
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

#### Terminal 2 - Frontend
```bash
cd frontend
ng serve
# Frontend runs on http://localhost:4200
```

### 3. Access Application
```
http://localhost:4200
```

---

## Troubleshooting

### Issue: NG0203 Injection Context Error
**Status**: ✅ FIXED in `app.config.ts`

If you get this error after pulling latest code:
1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Restart dev server: `ng serve`

### Issue: Angular Animations Not Found
**Status**: ✅ FIXED

Already installed via `npm install @angular/animations`

If you still see this error:
```bash
npm install @angular/animations@latest
```

### Issue: backgroundColor Deserialization Error
**Status**: ✅ FIXED in DTOs

The backend now accepts:
```json
{
  "name": "Board Name",
  "backgroundColor": "#hexcolor",
  "isPrivate": false,
  "workspaceId": "uuid"
}
```

### Issue: Sidebar Template Errors
**Status**: ✅ FIXED

Recent boards section removed from `sidebar.component.html` (property was deleted)

---

## API Endpoints

### Authentication
```
POST /auth/login
POST /auth/register
POST /auth/logout
GET  /auth/user
```

### Boards
```
POST   /boards                    # Create board
GET    /boards                    # List boards
GET    /boards/{boardId}          # Get board
PUT    /boards/{boardId}          # Update board (with backgroundColor)
DELETE /boards/{boardId}          # Delete board
```

### Workspaces
```
GET    /workspaces
POST   /workspaces
PUT    /workspaces/{id}
DELETE /workspaces/{id}
```

---

## Common Issues & Solutions

### Issue: Port 4200 Already in Use
```bash
ng serve --port 4201
```

### Issue: Port 8080 Already in Use
```bash
# Stop other Java processes or use different port
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

### Issue: CORS Errors
**Solution**: Ensure backend is running and accessible

Check CORS configuration in:
```
backend/src/main/java/com/taskflow/kanban/config/WebConfig.java
```

### Issue: Database Connection Error
```
1. Ensure MySQL/Database is running
2. Check application.yml for correct connection string
3. Run migrations: mvn db:migrate (if using Flyway)
```

### Issue: Login Not Working
```
1. Check backend is running on localhost:8080
2. Verify database has users table
3. Check interceptor configuration in app.config.ts
```

---

## Environment Setup

### Frontend (.env or environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/taskflow_kanban
    username: root
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
```

---

## Testing

### Frontend Unit Tests
```bash
ng test
```

### Backend Unit Tests
```bash
mvn test
```

### E2E Tests (if configured)
```bash
ng e2e
```

---

## Production Build

### Frontend
```bash
ng build --prod
# Output: dist/
```

### Backend
```bash
mvn clean package -DskipTests
# Output: target/taskflow-kanban-*.jar
```

---

## Deployment

### Docker
```bash
docker-compose up
```

### Manual Deployment
```bash
# Backend
java -jar target/taskflow-kanban-*.jar

# Frontend (via nginx or serve)
serve -s dist/ -l 4200
```

---

## Useful Commands

### Frontend
```bash
ng serve              # Start dev server
ng build              # Build for production
ng test               # Run tests
ng lint               # Run linter
ng generate component # Generate new component
ng generate service   # Generate new service
```

### Backend
```bash
mvn clean install     # Clean and install
mvn spring-boot:run   # Run application
mvn test              # Run tests
mvn compile           # Compile only
mvn package           # Create JAR
mvn clean package     # Clean and package
```

---

## Debug Mode

### Frontend Debug
1. Open DevTools (F12)
2. Go to Sources tab
3. Set breakpoints
4. Refresh page

### Backend Debug
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"
```

Then connect debugger to port 5005

---

## Performance Tips

### Frontend
```bash
# Enable production mode
ng serve --configuration production

# Use Chrome DevTools Performance tab
# Check Network tab for large files
```

### Backend
```bash
# Monitor logs
tail -f logs/taskflow-kanban.log

# Monitor database queries
# Enable query logging in application.yml
spring.jpa.show-sql: true
```

---

## Useful Files to Know

### Frontend
```
src/main.ts                           # Entry point
src/app/app.config.ts                 # Angular config
src/app/app.routes.ts                 # Route definitions
src/environments/environment.ts        # Environment config
```

### Backend
```
src/main/resources/application.yml     # Spring config
src/main/java/.../config/             # Application configs
src/main/java/.../security/           # Security configs
```

---

## Getting Help

1. **Check Documentation**
   - `LATEST_FIXES_JANUARY_20.md` - Recent fixes
   - `FULL_STACK_COMPLETION_REPORT.md` - System overview
   - `FRONTEND_QUICK_REFERENCE.md` - Frontend guide
   - `BACKEND_ANALYSIS_AND_FRONTEND_UPGRADES.md` - Backend guide

2. **Check Logs**
   - Frontend: Browser console (F12)
   - Backend: Terminal output or logs/

3. **Check Compilation**
   ```bash
   ng build                 # Frontend
   mvn clean compile        # Backend
   ```

---

## Quick Verification Checklist

Before considering setup complete:

- [ ] Backend compiles without errors
- [ ] Frontend compiles without errors
- [ ] Can access http://localhost:4200
- [ ] Login page loads
- [ ] No console errors (F12)
- [ ] Can create a board
- [ ] Can view boards list
- [ ] API calls are working

---

**Setup Complete? ✅ You're ready to go!**

Need help? Check the documentation files in the workspace root.
