# Script to push TaskFlow backend image to Docker Hub
# Run this when you have network connectivity to Docker Hub

param(
    [string]$Version = "latest",
    [switch]$SkipLogin = $false
)

Write-Host "`n=== Pushing TaskFlow Backend to Docker Hub ===" -ForegroundColor Cyan
Write-Host ""

# Check if image exists
$localImage = docker images medsidatt/taskflow-backend:local --format "{{.ID}}"
if ([string]::IsNullOrWhiteSpace($localImage)) {
    Write-Host "❌ Error: medsidatt/taskflow-backend:local image not found!" -ForegroundColor Red
    Write-Host "   Build it first: cd backend && mvn clean package -DskipTests" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found local image: medsidatt/taskflow-backend:local" -ForegroundColor Green

# Login to Docker Hub (unless skipped)
if (-not $SkipLogin) {
    Write-Host "`nLogging in to Docker Hub..." -ForegroundColor Yellow
    docker login -u medsidatt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Logged in successfully" -ForegroundColor Green
} else {
    Write-Host "`nSkipping login (using existing credentials)" -ForegroundColor Gray
}

# Tag the image
Write-Host "`nTagging image as medsidatt/taskflow-backend:$Version..." -ForegroundColor Yellow
docker tag medsidatt/taskflow-backend:local medsidatt/taskflow-backend:$Version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tagging failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Image tagged successfully" -ForegroundColor Green

# Also tag as latest if version is not latest
if ($Version -ne "latest") {
    Write-Host "Tagging as latest..." -ForegroundColor Yellow
    docker tag medsidatt/taskflow-backend:local medsidatt/taskflow-backend:latest
    Write-Host "✓ Tagged as latest" -ForegroundColor Green
}

# Push the image
Write-Host "`nPushing medsidatt/taskflow-backend:$Version to Docker Hub..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
docker push medsidatt/taskflow-backend:$Version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host "   Check your network connectivity and Docker Hub permissions" -ForegroundColor Yellow
    exit 1
}

# Push latest if version is not latest
if ($Version -ne "latest") {
    Write-Host "`nPushing medsidatt/taskflow-backend:latest..." -ForegroundColor Yellow
    docker push medsidatt/taskflow-backend:latest
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ Warning: Failed to push latest tag" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Latest tag pushed" -ForegroundColor Green
    }
}

Write-Host "`n✅ Successfully pushed medsidatt/taskflow-backend:$Version to Docker Hub!" -ForegroundColor Green
Write-Host "`nVerify at: https://hub.docker.com/r/medsidatt/taskflow-backend/tags" -ForegroundColor Cyan
Write-Host ""
