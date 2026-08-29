# API & Anti-DDoS Rate Limiting Test Script

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " STARTING E-COMMERCE SHOP API & ANTI-DDOS TESTS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8085/api"

# 1. Test Categories Endpoint
Write-Host "`n1. Testing GET /api/categories..." -ForegroundColor Yellow
try {
    $resCat = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Get
    Write-Host "SUCCESS: Categories count: $($resCat.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Test Products Endpoint
Write-Host "`n2. Testing GET /api/products..." -ForegroundColor Yellow
try {
    $resProd = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
    Write-Host "SUCCESS: Products retrieved: $($resProd.data.Count)" -ForegroundColor Green
    if ($resProd.data.Count -gt 0) {
        Write-Host "Sample product: $($resProd.data[0].name) - Price: $($resProd.data[0].price) VND" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test Auth Login
Write-Host "`n3. Testing POST /api/auth/login..." -ForegroundColor Yellow
$loginBody = @{ email = "admin@shop.com"; password = "admin123" } | ConvertTo-Json
try {
    $resLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "SUCCESS: Logged in as: $($resLogin.data.fullName) (Role: $($resLogin.data.role))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Anti-DDoS Rate Limiter Rapid Burst Test
Write-Host "`n4. Testing Anti-DDoS Rate Limiting Filter (Sending rapid burst of 15 requests to sensitive /api/auth/login)..." -ForegroundColor Yellow
$burstSuccess = 0
$rateLimitedCount = 0

1..15 | ForEach-Object {
    try {
        $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
        if ($r.StatusCode -eq 200) { $burstSuccess++ }
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 429) {
            $rateLimitedCount++
        }
    }
}

Write-Host "Anti-DDoS Burst Test Results:" -ForegroundColor Cyan
Write-Host "  - Successful requests allowed: $burstSuccess" -ForegroundColor Green
Write-Host "  - Blocked requests with HTTP 429 (Too Many Requests): $rateLimitedCount" -ForegroundColor Red

if ($rateLimitedCount -gt 0) {
    Write-Host "SUCCESS: Anti-DDoS Rate Limiter successfully intercepted excessive requests!" -ForegroundColor Green
} else {
    Write-Host "NOTICE: Rate limiter limit not exceeded yet within current window." -ForegroundColor Yellow
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host " ALL API TESTS COMPLETED" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
