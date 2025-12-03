# Script to restart backend server
Write-Host "🔄 Restarting backend server..." -ForegroundColor Cyan

# Kill process on port 5000
Write-Host "⏹️  Stopping existing server..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

# Copy JS files to dist
Write-Host "📁 Copying JS files to dist..." -ForegroundColor Yellow
if (!(Test-Path "dist/services")) {
    New-Item -ItemType Directory -Path "dist/services" -Force | Out-Null
}
Copy-Item "src/services/*.js" "dist/services/" -Force

# Build TypeScript
Write-Host "🔨 Building TypeScript..." -ForegroundColor Yellow
npm run build

# Start server
Write-Host "🚀 Starting server..." -ForegroundColor Green
npm start
