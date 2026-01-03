# TaskFlow Kanban - Development Startup Script
# Run this script to start the application in development mode

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TaskFlow Kanban - Development Mode  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "[1/4] Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    Write-Host "Or run frontend only without backend:" -ForegroundColor Yellow
    Write-Host "  cd frontend && npm start" -ForegroundColor Cyan
    exit 1
}

# Start PostgreSQL
Write-Host ""
Write-Host "[2/4] Starting PostgreSQL database..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up postgres -d
Write-Host "✓ PostgreSQL starting..." -ForegroundColor Green
Write-Host "Waiting 10 seconds for database to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Backend in background
Write-Host ""
Write-Host "[3/4] Starting Spring Boot backend..." -ForegroundColor Yellow
Write-Host "This will take 30-60 seconds..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; mvn spring-boot:run"
Write-Host "✓ Backend starting in new window..." -ForegroundColor Green

# Wait a bit more for backend to initialize
Write-Host "Waiting 20 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Start Frontend
Write-Host ""
Write-Host "[4/4] Starting Angular frontend..." -ForegroundColor Yellow
Write-Host "This will take 20-30 seconds..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"
Write-Host "✓ Frontend starting in new window..." -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Application Starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Yellow
Write-Host "  Frontend:  http://localhost:4200" -ForegroundColor Cyan
Write-Host "  Backend:   http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "  Swagger:   http://localhost:8080/api/swagger-ui.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏱️  Wait 1-2 minutes for everything to fully start" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Tip: Check the new terminal windows for logs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
