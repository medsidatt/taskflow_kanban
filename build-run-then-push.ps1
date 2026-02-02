# Build Docker images, create and run the full stack, then show how to push to Docker Hub.
# Run from project root. After testing, use the push commands at the end.
# Usage: .\build-run-then-push.ps1

$ErrorActionPreference = "Stop"

# Docker Hub username for tagging/push (set DOCKERHUB_USERNAME env or edit here)
$DockerHubUser = if ($env:DOCKERHUB_USERNAME) { $env:DOCKERHUB_USERNAME } else { "medsidatt" }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TaskFlow Kanban - Build, Run, Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Ensure .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env from template..." -ForegroundColor Yellow
    @"
POSTGRES_DB=taskflow
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=YourSecurePassword123!

JWT_SECRET=mySecretKeyForTaskFlowKanban2024!
JWT_EXPIRATION=86400000

SPRING_JPA_SHOW_SQL=false
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host "Created .env - update values if needed." -ForegroundColor Green
} else {
    Write-Host ".env found." -ForegroundColor Green
}
Write-Host ""

# 2. Build images
Write-Host "Building backend and frontend images..." -ForegroundColor Cyan
docker compose -f docker-compose.yml -f docker-compose.build.yml build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Build complete." -ForegroundColor Green
Write-Host ""

# 3. Create and run stack (postgres + backend + frontend)
Write-Host "Creating and starting containers..." -ForegroundColor Cyan
docker compose -f docker-compose.yml -f docker-compose.build.yml up -d
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Containers started." -ForegroundColor Green
Write-Host ""

# 4. Wait for backend to be healthy (optional)
Write-Host "Waiting for backend to be ready (up to ~60s)..." -ForegroundColor Cyan
$maxAttempts = 30
$attempt = 0
do {
    $attempt++
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:8080/api/actuator/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { break }
    } catch { }
    Start-Sleep -Seconds 2
} while ($attempt -lt $maxAttempts)
if ($attempt -ge $maxAttempts) {
    Write-Host "Backend may still be starting. Check: docker compose -f docker-compose.yml -f docker-compose.build.yml logs backend" -ForegroundColor Yellow
} else {
    Write-Host "Backend is ready." -ForegroundColor Green
}
Write-Host ""

# 5. Summary and push instructions
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Stack is running" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:  http://localhost:4200" -ForegroundColor White
Write-Host "Backend:   http://localhost:8080/api" -ForegroundColor White
Write-Host "Swagger:   http://localhost:8080/api/swagger-ui.html" -ForegroundColor White
Write-Host ""
Write-Host "Test the app (sign up, login), then push when ready:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  docker login" -ForegroundColor Yellow
Write-Host "  docker tag taskflow-backend:latest   $DockerHubUser/taskflow-backend:latest" -ForegroundColor Yellow
Write-Host "  docker tag taskflow-frontend:latest $DockerHubUser/taskflow-frontend:latest" -ForegroundColor Yellow
Write-Host "  docker push $DockerHubUser/taskflow-backend:latest" -ForegroundColor Yellow
Write-Host "  docker push $DockerHubUser/taskflow-frontend:latest" -ForegroundColor Yellow
Write-Host ""
Write-Host "Stop stack:  docker compose -f docker-compose.yml -f docker-compose.build.yml down" -ForegroundColor Gray
Write-Host ""
