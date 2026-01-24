# TaskFlow Kanban — Testing Guide

Complete guide to **unit**, **integration**, and **manual** testing for the TaskFlow Kanban application.

---

## Table of Contents

- [Unit & Integration Tests](#unit--integration-tests)
- [Test Configuration](#test-configuration)
- [CI/CD Testing](#cicd-testing)
- [Manual Testing](#manual-testing)
- [Troubleshooting](#troubleshooting)

---

## Unit & Integration Tests

### Backend (Maven + JUnit)

```bash
cd backend
./mvnw clean test
```

- **Profile**: `test` (H2 in-memory, Flyway disabled)
- **Reports**: `backend/target/surefire-reports/`
- **Coverage**: Surefire XML plus any custom report config

**Test types:**

| Type | Location | Examples |
|------|----------|----------|
| Unit | `*ServiceTest.java` | `AuthServiceTest`, `UserServiceTest` |
| Controller / Security | `*ControllerSecurityTest.java` | `BoardControllerSecurityTest`, `WorkspaceControllerSecurityTest` |

### Frontend (Karma + Jasmine)

```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

- **Config**: `angular.json` → Karma section
- **Specs**: `*.spec.ts` (e.g. `app.component.spec.ts`)
- **CI**: use `--watch=false --browsers=ChromeHeadless`; optional `--code-coverage`

### Running All Tests

```bash
# Backend
cd backend && ./mvnw clean test

# Frontend
cd frontend && npm test -- --watch=false --browsers=ChromeHeadless
```

---

## Test Configuration

### Backend (`application-test.properties`)

- **Database**: H2 in-memory (`jdbc:h2:mem:testdb`)
- **Flyway**: **disabled** (`spring.flyway.enabled=false`) — migrations use PostgreSQL-specific SQL
- **Schema**: Hibernate `ddl-auto=create-drop`
- **Initial data**: `src/test/resources/data.sql` — inserts USER and ADMIN roles
- **JWT**: Test secret and expiration in `application-test.properties`

### Security / Integration Tests

- **Workspace** update/delete: the authenticated user must be a **workspace member** (e.g. OWNER). Tests create a `WorkspaceMember` for the test user.
- **Board** operations (e.g. create column, create card): the user must be both a **workspace member** and a **board member** (e.g. OWNER). Tests create `WorkspaceMember` and `BoardMember` in `@BeforeEach`.
- **Auth**: Invalid login throws `UnauthorizedException` (not `IllegalArgumentException`). See `AuthServiceTest.login_invalidCredentials`.

### Reference

- [REFERENCE.md](REFERENCE.md) — test commands, config summary, troubleshooting

---

## CI/CD Testing

- **Backend CI/CD** (`.github/workflows/backend-ci.yml`): runs on `backend/**` changes; `./mvnw clean verify`, then Docker build/push on `main`.
- **Frontend CI/CD** (`.github/workflows/frontend-ci.yml`): runs on `frontend/**` changes; `npm ci`, build, `npm test -- --watch=false --browsers=ChromeHeadless`.
- **Full Stack Tests** (`.github/workflows/full-test.yml`): runs backend and frontend tests in parallel on push/PR to `main` or manual trigger.

See [REFERENCE.md](REFERENCE.md#cicd) for workflows and secrets.

---

## Manual Testing

### 1. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend: `http://localhost:8080/api`

### 2. Start Frontend

```bash
cd frontend
npm start
```

Frontend: `http://localhost:4200`

## 🧪 Testing Authentication

### Login Flow

1. **Navigate to Login Page**
   ```
   http://localhost:4200/login
   ```

2. **Test Form Validation**
   - Try submitting empty form → See error messages
   - Enter invalid email (e.g., "test") → See "Please enter a valid email address"
   - Enter short password (e.g., "123") → See "Password must be at least 6 characters"

3. **Test Password Visibility**
   - Click the eye icon 👁️ → Password shows
   - Click again → Password hides

4. **Test Valid Login**
   
   **Using Mock Data (if backend not connected):**
   - Email: `test@example.com`
   - Password: `password123`
   - Click "Sign In"
   - Should redirect to `/boards`

   **Using Real Backend:**
   - Use credentials from registered account
   - Or create account via register page first

5. **Test Remember Me**
   - Check "Remember me" checkbox
   - Login
   - Close browser and reopen
   - Should still be logged in (if backend supports it)

### Register Flow

1. **Navigate to Register Page**
   ```
   http://localhost:4200/register
   ```

2. **Test Form Validation**
   - Username: Minimum 3 characters
   - Email: Valid email format required
   - Password: Minimum 8 characters, must include:
     - At least 1 uppercase letter
     - At least 1 lowercase letter
     - At least 1 number
     - At least 1 special character
   - Confirm Password: Must match password
   - Terms: Must be checked

3. **Test Password Matching**
   - Enter different passwords
   - See "Passwords do not match" error
   - Make them match
   - Error disappears

4. **Create New Account**
   ```
   Username: john_doe
   Email: john@example.com
   Password: SecurePass123!
   Confirm Password: SecurePass123!
   [✓] Accept Terms
   ```
   - Click "Create Account"
   - Should redirect to `/boards`

## 📋 Testing Kanban Board

### Board List View

1. **Navigate to Boards**
   ```
   http://localhost:4200/boards
   ```

2. **View Sample Board**
   - See "Project Planning" board with gradient background
   - See board statistics (3 columns, 3 cards)
   - Hover over board → See elevation effect

3. **Click Board**
   - Click anywhere on board card
   - Should navigate to board view

4. **Test Create Board**
   - Click "+ Create Board" placeholder card
   - (Feature to be connected to API)

### Kanban Board View

1. **Navigate to Board View**
   ```
   http://localhost:4200/boards/1
   ```

2. **View Board Layout**
   - See board header with title and description
   - See 4 columns: "To Do", "In Progress", "Review", "Done"
   - See sample cards in columns
   - See "Add Column" button

3. **Test Drag & Drop Cards**
   
   **Move Card Between Columns:**
   - Click and hold a card in "To Do"
   - Drag to "In Progress" column
   - Release → Card moves to new column
   - See smooth animation

   **Reorder Cards in Same Column:**
   - Drag a card up or down within same column
   - Release → Card reorders

4. **Test Card Features**
   
   **Hover Over Card:**
   - Quick action buttons appear (Edit ✏️, Delete 🗑️)
   
   **Card Display Elements:**
   - 🏷️ **Labels**: See color-coded labels
   - 📅 **Due Date**: See relative time ("2 days from now")
   - 🔴 **Overdue**: Red background for overdue cards
   - 🟡 **Due Soon**: Yellow background for cards due within 2 days
   - 📊 **Priority**: See HIGH/MEDIUM/LOW with colored indicators
   - 📎 **Attachments**: See count
   - 💬 **Comments**: See count
   - 👥 **Members**: See member avatars

5. **Test Add Card**
   - Click "+ Add Card" in any column
   - Textarea appears
   - Type card title
   - Press Enter or click "Add Card"
   - Click "Cancel" to close
   - Press Escape to cancel

6. **Click Card for Details**
   - Click any card
   - Modal should open (feature to be implemented)

### Card Detail Modal (When Implemented)

Features to test:
- View full card details
- Edit card title and description
- Change priority
- Set/update due date
- Add/remove labels
- Add comments
- View activity log
- Upload attachments
- Delete card

## 🎨 Testing UI/UX

### Visual Design

1. **Colors & Gradients**
   - Login page: Purple gradient (#667eea → #764ba2)
   - Register page: Pink gradient (#f093fb → #f5576c)
   - Board list: Light gradient background
   - Board view: Purple gradient background
   - Cards: White with colored borders for priority

2. **Animations**
   - Login/Register card: Slide up on page load
   - Board cards: Hover elevation
   - Drag & drop: Smooth transitions
   - Loading spinner: Rotation animation
   - Error alert: Shake animation
   - Floating circles: Gentle movement

3. **Responsive Design**
   
   **Desktop (> 1024px):**
   - Full layout with all columns visible
   - Navbar with all links
   - Board grid: Multiple columns

   **Tablet (768px - 1024px):**
   - Horizontal scroll for board columns
   - Navbar simplified
   - Board grid: 2-3 columns

   **Mobile (< 768px):**
   - Single column board list
   - Horizontal scroll for Kanban
   - Hamburger menu (if implemented)
   - Touch-friendly buttons

### Loading States

1. **Global Loading Spinner**
   - Make API request
   - See full-screen spinner with backdrop
   - Spinner disappears when request completes

2. **Component Loading States**
   - Board list: "Loading boards..." with spinner
   - Board view: "Loading board..." with spinner

3. **Button Loading States**
   - Login button: Shows spinner and "Signing in..."
   - Register button: Shows spinner and "Creating account..."

### Error Handling

1. **Network Errors**
   - Disconnect from internet
   - Try to login
   - See error message: "An unexpected error occurred"

2. **Validation Errors**
   - Invalid email format
   - Short password
   - Mismatched passwords (register)
   - Empty required fields

3. **API Errors**
   - Wrong credentials → "Invalid email or password"
   - Account already exists → Error message
   - Resource not found → "Failed to load board"

## 🔐 Testing Security

### Authentication Guard

1. **Try Accessing Protected Routes**
   - Logout (if logged in)
   - Try to access: `http://localhost:4200/boards`
   - Should redirect to `/login`

2. **Test Token Expiration**
   - Login
   - Wait for token to expire (default: 24 hours)
   - Make a request
   - Should auto-refresh token or redirect to login

### CORS

1. **Cross-Origin Requests**
   - Frontend on `localhost:4200`
   - Backend on `localhost:8080`
   - Requests should work (CORS configured)

## 🔄 Testing with Backend API

### Prerequisites
- PostgreSQL running (Docker or local)
- Backend application running
- Database migrations applied

### API Endpoints to Test

#### Authentication
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### Boards (Requires JWT Token)
```bash
# Get all boards
curl http://localhost:8080/api/boards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get board by ID
curl http://localhost:8080/api/boards/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create board
curl -X POST http://localhost:8080/api/boards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Project",
    "description": "Project board",
    "workspaceId": 1
  }'
```

## 📊 Testing with Swagger UI

1. **Access Swagger UI**
   ```
   http://localhost:8080/api/swagger-ui.html
   ```

2. **Authorize**
   - Click "Authorize" button
   - Enter JWT token (get from login response)
   - Click "Authorize"

3. **Test Endpoints**
   - Expand any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - See response

## 🐳 Testing with Docker

### Full Stack Test

1. **Start All Services**
   ```bash
   docker-compose up --build
   ```

2. **Wait for Services to Start**
   - Database: ~10 seconds
   - Backend: ~30-60 seconds
   - Frontend: ~20-30 seconds

3. **Check Health**
   ```bash
   # Backend health
   curl http://localhost:8080/api/actuator/health
   
   # Frontend health
   curl http://localhost:4200/health
   ```

4. **Test Application**
   - Navigate to: `http://localhost:4200`
   - Should show login page
   - Complete authentication flow
   - Test Kanban board features

5. **View Logs**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f postgres
   ```

## 📱 Testing Responsive Design

### Browser DevTools

1. **Open DevTools**
   - Press F12
   - Click device toolbar icon (Ctrl+Shift+M)

2. **Test Breakpoints**
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

3. **Test Orientation**
   - Portrait mode
   - Landscape mode

4. **Test Touch Events**
   - Enable touch simulation
   - Test drag & drop with touch
   - Test button clicks

## ✅ Test Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Form validation works
- [ ] Password visibility toggle
- [ ] Register new account
- [ ] Password strength validation
- [ ] Password matching validation
- [ ] Redirect when authenticated
- [ ] Logout functionality

### Kanban Board
- [ ] View board list
- [ ] Open board
- [ ] View columns and cards
- [ ] Drag card to different column
- [ ] Reorder cards in same column
- [ ] Reorder columns
- [ ] Add new card
- [ ] View card labels
- [ ] View card priorities
- [ ] View due dates
- [ ] View card members
- [ ] Hover effects work

### UI/UX
- [ ] Loading spinners appear
- [ ] Error messages display correctly
- [ ] Animations are smooth
- [ ] Hover effects work
- [ ] Click interactions work
- [ ] Forms have proper validation
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### Performance
- [ ] Page loads quickly
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] No console warnings
- [ ] Images load quickly
- [ ] Lazy loading works

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Proper ARIA labels
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Form labels present

## Troubleshooting

### Unit / Integration Tests

| Issue | Solution |
|-------|----------|
| **Flyway / PostgreSQL SQL errors** in backend tests | Use `spring.flyway.enabled=false` in `application-test.properties`. Tests use H2 + Hibernate `create-drop` + `data.sql`. |
| **403 in workspace/board security tests** | Ensure test user is **workspace member** and **board member** (e.g. OWNER). See `WorkspaceControllerSecurityTest`, `BoardControllerSecurityTest`. |
| **Wrong exception in `AuthServiceTest.login_invalidCredentials`** | Expect `UnauthorizedException` (not `IllegalArgumentException`) for invalid login. |
| **Frontend specs fail on title / router** | Use `title === 'TaskFlow Kanban'`; mock `ThemeService` and `provideRouter([])`; assert on `router-outlet`, `app-loading-spinner`, `app-toast`. |
| **H2 / `data.sql` errors** | Ensure `spring.jpa.defer-datasource-initialization=true` and `data.sql` inserts only USER/ADMIN roles. |

### Manual / E2E

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Ensure PostgreSQL is running: `docker-compose up postgres` |
| **CORS errors** | Backend CORS must allow `localhost:4200` |
| **401 Unauthorized** | Check JWT is sent, not expired; log in again |
| **Drag & drop not working** | Verify `@angular/cdk`; check console; refresh |
| **Styles not loading** | `rm -rf frontend/.angular/cache` then `npm start` |

See [REFERENCE.md](REFERENCE.md#testing) for commands and config.

## 📈 Performance Testing

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Check scores:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 80

### Load Testing
```bash
# Install Apache Bench (if not installed)
# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json http://localhost:8080/api/auth/login
```

## 📝 Test Data

### Sample Users
```
User 1:
  Email: admin@taskflow.com
  Password: Admin123!

User 2:
  Email: user@taskflow.com
  Password: User123!
```

### Sample Boards
- Project Planning (4 columns, 4 cards)
- Development Sprint (columns TBD)
- Marketing Campaign (columns TBD)

## 🎯 Advanced Testing

### JWT Token Testing
1. Login and copy JWT token from localStorage
2. Use token in Postman/curl
3. Test token expiration
4. Test refresh token flow

### Database Testing
```bash
# Connect to PostgreSQL
docker exec -it taskflow-postgres psql -U taskflow_user -d taskflow_db

# Check tables
\dt

# Check data
SELECT * FROM users;
SELECT * FROM boards;
SELECT * FROM cards;
```

### Integration Testing
- Test complete user flow: Register → Create Board → Add Cards → Move Cards
- Test multi-user scenarios
- Test concurrent modifications

## 📊 Success Criteria

A successful test means:
- ✅ All features work as expected
- ✅ No console errors
- ✅ Smooth animations
- ✅ Fast load times (< 2 seconds)
- ✅ Responsive on all devices
- ✅ Accessible to all users
- ✅ Secure (no XSS, CSRF vulnerabilities)

## 🔍 Debugging Tips

1. **Check Browser Console**
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Check Backend Logs**
   ```bash
   # View logs
   tail -f logs/taskflow-kanban.log
   
   # Or in console
   mvn spring-boot:run
   ```

3. **Check Database**
   ```bash
   # Check database connection
   docker-compose logs postgres
   ```

4. **Clear Cache**
   ```bash
   # Frontend
   rm -rf frontend/.angular/cache
   
   # Browser
   Hard refresh: Ctrl+Shift+R
   Clear storage: DevTools → Application → Clear Storage
   ```

---

**Happy Testing! 🚀**

- **Reference**: [REFERENCE.md](REFERENCE.md) — commands, config, API, CI/CD  
- **Project overview**: [README.md](../README.md)
