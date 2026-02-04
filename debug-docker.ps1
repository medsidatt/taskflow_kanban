# Docker Debugging Script for TaskFlow Kanban
# Run this from the directory where you execute docker compose

Write-Host "`n=== TaskFlow Kanban Docker Debugging ===" -ForegroundColor Cyan
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# 1. Check .env file
Write-Host "1. Checking .env file..." -ForegroundColor Yellow
$envExists = Test-Path .env
if ($envExists) {
    Write-Host "   ✓ .env file exists" -ForegroundColor Green
    Write-Host "   Contents:" -ForegroundColor Gray
    $envVars = @{}
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            $envVars[$key] = $value
            $displayValue = if ($key -match 'PASSWORD|SECRET') { '***' } else { $value }
            Write-Host "     $key = $displayValue" -ForegroundColor Gray
        }
    }
    
    # Check required variables
    $required = @('POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'JWT_SECRET')
    $missing = @()
    foreach ($req in $required) {
        if (-not $envVars.ContainsKey($req) -or [string]::IsNullOrWhiteSpace($envVars[$req])) {
            $missing += $req
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Host "   ✗ Missing required variables: $($missing -join ', ')" -ForegroundColor Red
    } else {
        Write-Host "   ✓ All required variables present" -ForegroundColor Green
    }
} else {
    Write-Host "   ✗ .env file MISSING!" -ForegroundColor Red
    Write-Host "   → Copy .env from C:\workspace\taskflow-kanban or create it manually" -ForegroundColor Yellow
}

Write-Host ""

# 2. Check Docker Compose config
Write-Host "2. Checking Docker Compose configuration..." -ForegroundColor Yellow
try {
    $config = docker compose config 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Docker Compose config is valid" -ForegroundColor Green
        
        # Check for empty variables
        $emptyVars = $config | Select-String -Pattern '\$\{[^}]+\}' | Select-Object -First 5
        if ($emptyVars) {
            Write-Host "   ⚠ Found unresolved variables (may be empty):" -ForegroundColor Yellow
            $emptyVars | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
        }
    } else {
        Write-Host "   ✗ Docker Compose config error:" -ForegroundColor Red
        Write-Host "   $config" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Failed to check config: $_" -ForegroundColor Red
}

Write-Host ""

# 3. Check containers status
Write-Host "3. Checking container status..." -ForegroundColor Yellow
try {
    $psOutput = docker compose ps 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host $psOutput
        $containers = docker compose ps --format json | ConvertFrom-Json
        $allHealthy = $true
        foreach ($container in $containers) {
            $status = $container.State
            $health = $container.Health
            if ($status -ne 'running') {
                Write-Host "   ✗ $($container.Name): $status" -ForegroundColor Red
                $allHealthy = $false
            } elseif ($health -and $health -ne 'healthy') {
                Write-Host "   ⚠ $($container.Name): $status ($health)" -ForegroundColor Yellow
                $allHealthy = $false
            } else {
                Write-Host "   ✓ $($container.Name): $status" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "   ⚠ No containers running (run 'docker compose up -d' first)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Failed to check containers: $_" -ForegroundColor Red
}

Write-Host ""

# 4. Check backend health endpoint
Write-Host "4. Checking backend health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/actuator/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✓ Backend is healthy: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend health check failed" -ForegroundColor Red
    Write-Host "     Error: $_" -ForegroundColor Gray
    Write-Host "     → Check if backend container is running and healthy" -ForegroundColor Yellow
}

Write-Host ""

# 5. Check recent backend logs
Write-Host "5. Recent backend logs (last 15 lines)..." -ForegroundColor Yellow
try {
    $logs = docker compose logs --tail=15 backend 2>&1
    if ($logs) {
        Write-Host $logs -ForegroundColor Gray
        
        # Check for common errors
        if ($logs -match 'Password authentication failed') {
            Write-Host "   ✗ Database authentication error detected!" -ForegroundColor Red
            Write-Host "     → Check POSTGRES_USER and POSTGRES_PASSWORD in .env" -ForegroundColor Yellow
        }
        if ($logs -match 'JWT_SECRET|JWT') {
            Write-Host "   ⚠ JWT-related messages found (check if JWT_SECRET is set)" -ForegroundColor Yellow
        }
        if ($logs -match 'Started.*Application') {
            Write-Host "   ✓ Backend started successfully" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠ No logs available (container may not be running)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Failed to get logs: $_" -ForegroundColor Red
}

Write-Host ""

# 6. Check PostgreSQL logs
Write-Host "6. Recent PostgreSQL logs (last 10 lines)..." -ForegroundColor Yellow
try {
    $pgLogs = docker compose logs --tail=10 postgres 2>&1
    if ($pgLogs) {
        Write-Host $pgLogs -ForegroundColor Gray
        if ($pgLogs -match 'ready to accept connections') {
            Write-Host "   ✓ PostgreSQL is ready" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   ⚠ Could not retrieve PostgreSQL logs" -ForegroundColor Yellow
}

Write-Host ""

# 7. Check volumes
Write-Host "7. Checking volumes..." -ForegroundColor Yellow
try {
    $volumes = docker volume ls --format json | ConvertFrom-Json | Where-Object { $_.Name -match 'postgres' }
    if ($volumes) {
        Write-Host "   Found PostgreSQL volumes:" -ForegroundColor Gray
        foreach ($vol in $volumes) {
            Write-Host "     - $($vol.Name)" -ForegroundColor Gray
            $volInfo = docker volume inspect $vol.Name --format '{{.Mountpoint}}' 2>&1
            Write-Host "       Mountpoint: $volInfo" -ForegroundColor DarkGray
        }
        Write-Host "   ⚠ Different directory = different volume = fresh database" -ForegroundColor Yellow
        Write-Host "     → If database is empty, use Sign up first, then login" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠ No PostgreSQL volumes found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ Could not check volumes" -ForegroundColor Yellow
}

Write-Host ""

# 8. Check network
Write-Host "8. Checking network connectivity..." -ForegroundColor Yellow
try {
    $networks = docker network ls --format json | ConvertFrom-Json | Where-Object { $_.Name -match 'taskflow' }
    if ($networks) {
        Write-Host "   Found networks:" -ForegroundColor Gray
        foreach ($net in $networks) {
            Write-Host "     - $($net.Name)" -ForegroundColor Gray
            $netInfo = docker network inspect $net.Name --format '{{range .Containers}}{{.Name}} {{end}}' 2>&1
            if ($netInfo) {
                Write-Host "       Containers: $netInfo" -ForegroundColor DarkGray
            }
        }
    } else {
        Write-Host "   ⚠ No taskflow networks found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ Could not check networks" -ForegroundColor Yellow
}

Write-Host ""

# Summary and recommendations
Write-Host "=== Summary & Recommendations ===" -ForegroundColor Cyan

$issues = @()

if (-not $envExists) {
    $issues += "Missing .env file - copy from project root"
}

if ($missing -and $missing.Count -gt 0) {
    $issues += "Missing required environment variables in .env"
}

if ($issues.Count -eq 0) {
    Write-Host "✓ No obvious configuration issues found" -ForegroundColor Green
    Write-Host ""
    Write-Host "If login/signup still fails:" -ForegroundColor Yellow
    Write-Host "  1. Check browser DevTools (F12) → Network tab for API errors" -ForegroundColor Gray
    Write-Host "  2. Try Sign up first (fresh database may have no users)" -ForegroundColor Gray
    Write-Host "  3. Clear browser cache/cookies for localhost:4200" -ForegroundColor Gray
    Write-Host "  4. Check docker compose logs backend for detailed errors" -ForegroundColor Gray
} else {
    Write-Host "⚠ Issues found:" -ForegroundColor Yellow
    foreach ($issue in $issues) {
        Write-Host "  - $issue" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Quick fixes:" -ForegroundColor Yellow
    Write-Host "  1. Copy .env from C:\workspace\taskflow-kanban to current directory" -ForegroundColor Gray
    Write-Host "  2. Verify all required variables are set" -ForegroundColor Gray
    Write-Host "  3. Run: docker compose down && docker compose up -d" -ForegroundColor Gray
}

Write-Host ""
Write-Host "For detailed debugging guide, see: docs\DOCKER_DEBUG.md" -ForegroundColor Cyan
Write-Host ""
