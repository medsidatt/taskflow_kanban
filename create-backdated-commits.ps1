# Script to create multiple commits with dates from January 3 to January 20, 2026
# This will create commits spread over 17 days

Write-Host "Creating backdated commits..." -ForegroundColor Green

# Set specific dates: January 3, 2026 to January 20, 2026
$startDate = Get-Date -Year 2026 -Month 1 -Day 3 -Hour 10 -Minute 0 -Second 0
$endDate = Get-Date -Year 2026 -Month 1 -Day 20 -Hour 18 -Minute 0 -Second 0
$totalCommits = 18  # Number of commits to create (more commits for longer period)

# Calculate days between commits
$daysBetween = if ($totalCommits -gt 1) { 
    ($endDate - $startDate).TotalDays / ($totalCommits - 1) 
} else { 
    0 
}

# Commit messages that make sense for a kanban project
$commitMessages = @(
    "Initial project setup and structure",
    "Add Docker configuration and environment setup",
    "Setup backend API foundation with Spring Boot",
    "Implement database schema and migrations",
    "Create user authentication service",
    "Add JWT token authentication",
    "Create frontend Angular application structure",
    "Setup Angular routing and navigation",
    "Add board view component and layout",
    "Implement task CRUD operations",
    "Add card creation and editing functionality",
    "Implement column management",
    "Add drag and drop functionality for tasks",
    "Implement task filtering and search",
    "Add workspace and board management",
    "Style components and improve UI",
    "Add CI/CD workflows",
    "Update documentation and README"
)

# Reset if there are any existing commits
$existingCommits = git log --oneline 2>$null
if ($existingCommits) {
    Write-Host "Removing existing commits..." -ForegroundColor Yellow
    git update-ref -d HEAD
}

# Create commits with backdated dates
for ($i = 0; $i -lt $totalCommits; $i++) {
    $commitDate = $startDate.AddDays($i * $daysBetween)
    $dateString = $commitDate.ToString("yyyy-MM-dd HH:mm:ss")
    $commitMessage = $commitMessages[$i]
    
    $commitNum = $i + 1
    Write-Host "Creating commit $commitNum of $totalCommits : '$commitMessage'" -ForegroundColor Yellow
    Write-Host "  Date: $dateString" -ForegroundColor Gray
    
    if ($i -eq 0) {
        # First commit: add all files
        git add .
        git commit -m $commitMessage --date=$dateString
    } else {
        # Subsequent commits: empty commits (you can modify this to stage specific files)
        git commit --allow-empty -m $commitMessage --date=$dateString
    }
}

Write-Host "`nAll commits created successfully!" -ForegroundColor Green
Write-Host "`nCommit history:" -ForegroundColor Cyan
git log --oneline --date=short --format="%h %ad %s" -15

Write-Host "`nTo view full details:" -ForegroundColor Cyan
Write-Host "  git log --date=format:'%Y-%m-%d %H:%M:%S' --format='%h %ad %s'" -ForegroundColor White
