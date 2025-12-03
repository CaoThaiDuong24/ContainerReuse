# Test container filter by depotId
Write-Host "`n🧪 Testing Container Filter by DepotId..." -ForegroundColor Yellow

Start-Sleep -Seconds 1

# Test with depotId=15
Write-Host "`n📍 Testing depotId=15:" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod 'http://localhost:5000/api/containers?depotId=15'
    Write-Host "  ✅ Success: $($response.success)" -ForegroundColor Green
    Write-Host "  📦 Total containers: $($response.count)" -ForegroundColor Green
    if ($response.data.Count -gt 0) {
        $uniqueDepotIds = $response.data.depotId | Select-Object -Unique
        Write-Host "  🏢 Unique depotIds in response: $uniqueDepotIds" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ❌ Error: $_" -ForegroundColor Red
}

# Test with depotId=39
Write-Host "`n📍 Testing depotId=39:" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod 'http://localhost:5000/api/containers?depotId=39'
    Write-Host "  ✅ Success: $($response.success)" -ForegroundColor Green
    Write-Host "  📦 Total containers: $($response.count)" -ForegroundColor Green
    if ($response.data.Count -gt 0) {
        $uniqueDepotIds = $response.data.depotId | Select-Object -Unique
        Write-Host "  🏢 Unique depotIds in response: $uniqueDepotIds" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ❌ Error: $_" -ForegroundColor Red
}

# Test without filter (should return all)
Write-Host "`n📍 Testing without filter (all containers):" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod 'http://localhost:5000/api/containers'
    Write-Host "  ✅ Success: $($response.success)" -ForegroundColor Green
    Write-Host "  📦 Total containers: $($response.count)" -ForegroundColor Green
    if ($response.data.Count -gt 0) {
        $depotCounts = $response.data | Group-Object -Property depotId | ForEach-Object { "$($_.Name): $($_.Count)" }
        Write-Host "  🏢 Containers by depot: $($depotCounts -join ', ')" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ❌ Error: $_" -ForegroundColor Red
}

Write-Host "`n✅ Testing completed!`n" -ForegroundColor Yellow
