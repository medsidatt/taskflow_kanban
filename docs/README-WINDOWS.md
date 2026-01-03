# TaskFlow Kanban - Windows Quick Start

Easy startup for Windows users!

## 🚀 Option 1: Frontend Only (Recommended First)

**No Docker or Backend needed!** Test the complete UI with mock data.

### Using PowerShell Script:
```powershell
.\start-frontend-only.ps1
```

### Or Manually:
```powershell
cd frontend
npm start
```

Then visit: **http://localhost:4200**

**What Works:**
- ✅ Complete Kanban UI
- ✅ Drag & drop cards
- ✅ Beautiful gradients and animations
- ✅ Sample boards and cards
- ✅ All visual features

---

## 🚀 Option 2: Full Stack (Requires Docker Desktop)

### Prerequisites:
1. **Start Docker Desktop** (Very Important!)
   - Open Docker Desktop application
   - Wait for it to fully start
   - Look for the whale icon in system tray

### Using PowerShell Script:
```powershell
.\start-dev.ps1
```

This script will:
1. ✅ Check Docker is running
2. ✅ Start PostgreSQL
3. ✅ Start Spring Boot backend
4. ✅ Start Angular frontend

### Or Using Docker Compose:
```powershell
docker-compose up --build
```

Then visit: **http://localhost:4200**

---

## 📱 Access Points

Once started:

```
Frontend:     http://localhost:4200
Login:        http://localhost:4200/login
Register:     http://localhost:4200/register
Boards:       http://localhost:4200/boards

Backend API:  http://localhost:8080/api
Swagger UI:   http://localhost:8080/api/swagger-ui.html
Health:       http://localhost:8080/api/actuator/health

Database:     localhost:5432 (taskflow_db)
```

---

## 🎯 What to Test

### 1. Login Page
- Beautiful purple gradient background
- Email and password validation
- Password visibility toggle
- Loading states

### 2. Register Page
- Pink gradient background
- Strong password requirements
- Password matching validation
- Terms checkbox

### 3. Board List
- Grid of boards with gradients
- Board statistics
- Create board button

### 4. Kanban Board
- **Drag & Drop**: Move cards between columns!
- **Labels**: Color-coded organization
- **Priorities**: High (red), Medium (orange), Low (blue)
- **Due Dates**: With overdue/due soon indicators
- **Members**: Team member avatars
- **Add Card**: Click "+ Add Card" in any column

---

## 🐛 Common Issues

### "Docker is not running"
**Solution:** Open Docker Desktop and wait for it to start

### "Port 8080 already in use"
**Solution:** 
```powershell
# Find what's using it
netstat -ano | findstr :8080

# Kill the process or change port in docker-compose.yml
```

### "npm not found"
**Solution:** Install Node.js 20+ from https://nodejs.org

### "mvn not found"
**Solution:** Either:
- Install Maven from https://maven.apache.org
- Or just use Docker (Option 2 above)

---

## 💡 Pro Tips

### Tip 1: Test UI First
Always test the frontend first with mock data. It's faster and shows all features!

### Tip 2: View Logs
```powershell
# Docker logs
docker-compose logs -f

# Backend logs (if running locally)
# Check the PowerShell window that opened
```

### Tip 3: Clear Cache
If something doesn't work:
```powershell
# Clear Angular cache
Remove-Item -Recurse -Force frontend\.angular\cache

# Clear browser cache
# Hard refresh: Ctrl + Shift + R
```

### Tip 4: Use Makefile
If you have `make` installed:
```powershell
make dev          # Start all in dev mode
make frontend     # Frontend only
make backend      # Backend only
make db           # Database only
```

---

## ✅ Quick Checklist

Before starting:
- [ ] Node.js 20+ installed
- [ ] npm 10+ installed
- [ ] (Optional) Docker Desktop installed and running
- [ ] (Optional) Java 21 installed
- [ ] (Optional) Maven installed

After starting:
- [ ] Can access http://localhost:4200
- [ ] Login page loads with purple gradient
- [ ] Board page shows Kanban board
- [ ] Can drag cards between columns
- [ ] Animations are smooth

---

## 🎉 You're Ready!

Run this command to start:

```powershell
.\start-frontend-only.ps1
```

Or if Docker Desktop is running:

```powershell
.\start-dev.ps1
```

**Enjoy your Kanban board! 🚀**

---

For detailed docs, see [README.md](README.md)
For testing guide, see [TESTING-GUIDE.md](TESTING-GUIDE.md)
