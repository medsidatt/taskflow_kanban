# TaskFlow Kanban - Frontend Only Startup Script
# Run this to test the UI without backend (uses mock data)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TaskFlow Kanban - Frontend Only     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Angular development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "This includes MOCK DATA for testing:" -ForegroundColor Green
Write-Host "  ✓ Sample Kanban board" -ForegroundColor Green
Write-Host "  ✓ Working drag & drop" -ForegroundColor Green
Write-Host "  ✓ Sample cards with all features" -ForegroundColor Green
Write-Host "  ✓ Beautiful UI components" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Authentication calls will fail (no backend)" -ForegroundColor Yellow
Write-Host "But you can still navigate to /boards to see the UI!" -ForegroundColor Yellow
Write-Host ""

Set-Location frontend
npm start
