# TaskFlow Kanban - Complete Setup Guide

## ✅ What's Been Fixed

### Frontend Issues Resolved
- ✅ Fixed TypeScript type errors in board-card component
- ✅ Fixed User model to include `name`, `firstName`, `lastName`, `avatarUrl`
- ✅ Fixed auth models (`LoginRequest` and `RegisterRequest`)
- ✅ Fixed boolean type coercion issues
- ✅ Updated navbar to use username as fallback
- ✅ Installed Angular CDK for drag & drop

### Backend Issues Resolved
- ✅ Fixed logback-spring.xml configuration error
- ✅ Changed from `SizeAndTimeBasedFNATP` to `SizeAndTimeBasedRollingPolicy`
- ✅ Backend compiles successfully
- ✅ Fixed .env file encoding (UTF-8)

## 🎯 Current Status

### ✅ Working Features
- **Frontend Login Page**: Fully functional with validation
- **Frontend Register Page**: Complete with password strength validation
- **Kanban Board UI**: Beautiful drag & drop interface with mock data
- **Board List**: Grid view with sample boards
- **Navigation**: Navbar with routing
- **Interceptors**: Auth, Loading, Error handling
- **Models**: All TypeScript interfaces defined

### ⏳ Requires Setup
- **Database**: PostgreSQL needs to be started
- **Backend API**: Needs database to run

## 🚀 Setup Options

### Option 1: Test Frontend Only (No Backend Required)

The frontend works with **mock data** without the backend!

```bash
cd frontend
npm start
```

Then navigate to: `http://localhost:4200/login`

**What Works:**
- ✅ Beautiful login/register pages
- ✅ Form validation
- ✅ Board list with sample board
- ✅ Full Kanban board with drag & drop
- ✅ Sample cards with labels, priorities, due dates
- ⚠️ Authentication calls will fail (mock data in BoardService)

**Test This First** to see the complete UI/UX!

### Option 2: Full Stack with Docker

**Prerequisites:**
- Install Docker Desktop
- Start Docker Desktop (Important!)

**Steps:**
```bash
# 1. Ensure .env file exists and has proper encoding (already fixed)

# 2. Start all services
docker-compose up --build

# Wait 2-3 minutes for all services to start

# 3. Access application
Frontend: http://localhost:4200
Backend: http://localhost:8080/api
Swagger: http://localhost:8080/api/swagger-ui.html
```

### Option 3: Development Mode (Backend Locally)

**Prerequisites:**
- Docker Desktop running (for PostgreSQL only)
- Java 21 installed
- Maven installed

**Steps:**

1. **Start PostgreSQL Only**
   ```bash
   # Make sure Docker Desktop is running first!
   docker-compose -f docker-compose.dev.yml up postgres -d
   
   # Wait 10 seconds for database to start
   ```

2. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```

4. **Access**
   - Frontend: `http://localhost:4200`
   - Backend: `http://localhost:8080/api`

## 🐛 Troubleshooting

### Issue: Docker Desktop Not Running

**Error:** `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`

**Solution:**
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray)
3. Run docker commands again

### Issue: Database Connection Failed

**Error:** `password authentication failed for user "taskflow_user"`

**Solution:**
```bash
# 1. Remove existing database volume
docker-compose down -v

# 2. Verify .env file
cat .env

# 3. Start fresh
docker-compose up postgres -d
```

### Issue: Port Already in Use

**Error:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Solution:**
```bash
# Find what's using the port
netstat -ano | findstr :8080

# Kill the process or change port in docker-compose.yml
```

### Issue: Frontend Compilation Errors

**Solution:**
```bash
cd frontend

# Clear cache
Remove-Item -Recurse -Force .angular/cache -ErrorAction SilentlyContinue

# Reinstall dependencies
npm install

# Start again
npm start
```

## 📋 Verification Checklist

### Frontend ✅
- [ ] Navigate to `http://localhost:4200/login`
- [ ] See beautiful login page with purple gradient
- [ ] Form validation works
- [ ] Navigate to `/register`
- [ ] See register page with pink gradient
- [ ] Navigate to `/boards` (will redirect to login if not authenticated)
- [ ] Login bypassed for testing → See board list
- [ ] Click board → See Kanban board with drag & drop

### Backend (When Running)
- [ ] Navigate to `http://localhost:8080/api/actuator/health`
- [ ] See: `{"status":"UP"}`
- [ ] Navigate to `http://localhost:8080/api/swagger-ui.html`
- [ ] See Swagger documentation
- [ ] Test `/api/auth/register` endpoint
- [ ] Test `/api/auth/login` endpoint

### Database (When Running)
```bash
# Connect to database
docker exec -it taskflow-postgres-dev psql -U taskflow_user -d taskflow_db

# Check tables
\dt

# Expected tables: users, roles, workspaces, boards, columns, cards, etc.
```

## 🎯 Recommended Testing Order

### 1. Test Frontend Only (5 minutes)
```bash
cd frontend
npm start
# Visit http://localhost:4200/login
```

**What to Test:**
- Login page UI
- Register page UI
- Board list (sample board)
- Kanban board with drag & drop
- Card interactions
- Responsive design

### 2. Start Database (2 minutes)
```bash
# Start Docker Desktop first!
docker-compose -f docker-compose.dev.yml up postgres -d

# Wait 10 seconds, then check:
docker ps
# Should see: taskflow-postgres-dev running
```

### 3. Start Backend (2 minutes)
```bash
cd backend
mvn spring-boot:run

# Wait for "Started TaskFlowKanbanBackendApplication"
# Backend will be at http://localhost:8080/api
```

### 4. Test Full Integration (10 minutes)
- Register new account
- Login with credentials
- Create boards via Swagger UI
- View boards in frontend
- Test all Kanban features

## 📚 Quick Reference

### URLs
```
Frontend:        http://localhost:4200
Login:          http://localhost:4200/login
Register:       http://localhost:4200/register
Boards:         http://localhost:4200/boards
Board View:     http://localhost:4200/boards/1

Backend API:    http://localhost:8080/api
Swagger UI:     http://localhost:8080/api/swagger-ui.html
Health Check:   http://localhost:8080/api/actuator/health

Database:       localhost:5432 (taskflow_db)
```

### Default Credentials (.env)
```
Database User:     taskflow_user
Database Password: taskflow_secure_password_2024
Database Name:     taskflow_db
```

### Docker Commands
```bash
# Start database only
docker-compose -f docker-compose.dev.yml up postgres -d

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down

# Clean everything (including data)
docker-compose down -v
```

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Frontend loads at `localhost:4200`
2. ✅ Login page shows with purple gradient
3. ✅ Board list shows sample board
4. ✅ Kanban board shows with drag & drop working
5. ✅ Backend responds at `localhost:8080/api/actuator/health`
6. ✅ Swagger UI loads with all endpoints
7. ✅ Database accepts connections

## 🆘 Need Help?

### Current State Works Without Backend!

The frontend is fully functional with **mock data**. You can:
- ✅ Test the entire UI
- ✅ See the Kanban board
- ✅ Drag and drop cards
- ✅ View all components
- ✅ Test responsive design

**Just run:**
```bash
cd frontend
npm start
```

And enjoy the beautiful Kanban interface! 🎨

### For Full Backend Integration

1. **Start Docker Desktop**
2. **Run database**: `docker-compose -f docker-compose.dev.yml up postgres -d`
3. **Run backend**: `cd backend && mvn spring-boot:run`
4. **Run frontend**: `cd frontend && npm start`

---

**Questions?** Check [README.md](README.md) or [TESTING-GUIDE.md](TESTING-GUIDE.md)
