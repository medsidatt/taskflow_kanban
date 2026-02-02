# Script to pull and run TaskFlow Kanban from Docker Hub
# Make sure you have a .env file with required variables

Write-Host "🐳 Pulling Docker images from Docker Hub..." -ForegroundColor Cyan

# Pull images
docker pull medsidatt/taskflow-backend:latest
docker pull medsidatt/taskflow-frontend:latest
docker pull postgres:16-alpine

Write-Host "✅ Images pulled successfully!" -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    
    @"
# Database Configuration (must match between Postgres and Backend)
POSTGRES_DB=taskflow
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=YourSecurePassword123!

# JWT Configuration
JWT_SECRET=mySecretKeyForTaskFlowKanban2024!
JWT_EXPIRATION=86400000

# Optional
SPRING_JPA_SHOW_SQL=false
"@ | Out-File -FilePath .env -Encoding utf8
    
    Write-Host "✅ Created .env file. Please update the values!" -ForegroundColor Yellow
    Write-Host "Press Enter to continue or Ctrl+C to edit .env first..."
    Read-Host
}

Write-Host "🚀 Starting containers with docker-compose..." -ForegroundColor Cyan
docker-compose up -d

Write-Host ""
Write-Host "✅ Containers started!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Service URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:4200" -ForegroundColor White
Write-Host "  Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "  Swagger UI: http://localhost:8080/api/swagger-ui.html" -ForegroundColor White
Write-Host ""
Write-Host "📊 Check container status:" -ForegroundColor Cyan
Write-Host "  docker-compose ps" -ForegroundColor White
Write-Host ""
Write-Host "📝 View logs:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Stop containers:" -ForegroundColor Cyan
Write-Host "  docker-compose down" -ForegroundColor White
