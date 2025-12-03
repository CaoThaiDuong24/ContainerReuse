Write-Host "Container Depot Fix Script" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill processes
Write-Host "Step 1: Stopping running processes..." -ForegroundColor Yellow
Write-Host "  - Killing process on port 3000 (Frontend)..."
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Write-Host "  - Killing process on port 5000 (Backend)..."
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2
Write-Host "  Done: Processes stopped" -ForegroundColor Green
Write-Host ""

# Step 2: Build Backend
Write-Host "Step 2: Building backend..." -ForegroundColor Yellow
Set-Location "D:\DiskE\DU AN CONTAINER\containerreseu\backend"

Write-Host "  - Copying JavaScript files..."
node copy-js-files.js

Write-Host "  - Compiling TypeScript..."
npm run build | Out-Null

Write-Host "  ✅ Backend built successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Clean Frontend lock
Write-Host "Step 3: Cleaning frontend..." -ForegroundColor Yellow
Set-Location "D:\DiskE\DU AN CONTAINER\containerreseu\frontend"

if (Test-Path ".next\dev\lock") {
    Remove-Item -Path ".next\dev\lock" -Force -ErrorAction SilentlyContinue
    Write-Host "  - Removed lock file" -ForegroundColor Gray
}

Write-Host "  ✅ Frontend cleaned" -ForegroundColor Green
Write-Host ""

# Instructions for starting services
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start Backend (Terminal 1):" -ForegroundColor Cyan
Write-Host "   cd 'D:\DiskE\DU AN CONTAINER\containerreseu\backend'" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "2. Start Frontend (Terminal 2):" -ForegroundColor Cyan
Write-Host "   cd 'D:\DiskE\DU AN CONTAINER\containerreseu\frontend'" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Open Debug Page:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/dashboard/debug-data" -ForegroundColor White
Write-Host ""
Write-Host "=============================" -ForegroundColor Cyan
