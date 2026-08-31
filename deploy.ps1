# Script Tu dong Deploy Shop len Ubuntu VM (192.168.159.120)
$UBUNTU_USER = "quyle"
$UBUNTU_IP = "192.168.159.120"
$REMOTE_DIR = "~/shop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " 📦 Dang nén code (loại bỏ node_modules & target)..." -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# Create tar archive excluding node_modules and target
tar --exclude="frontend/node_modules" --exclude="backend/target" --exclude=".git" -czf shop.tar.gz backend frontend docker-compose.yml

Write-Host "`n🚀 Dang truyen file shop.tar.gz sang Ubuntu ($UBUNTU_IP)..." -ForegroundColor Yellow
scp shop.tar.gz "$($UBUNTU_USER)@$($UBUNTU_IP):~/"

# Remove local temp archive
Remove-Item shop.tar.gz -ErrorAction SilentlyContinue

Write-Host "`n🐳 Dang giai nen va kich hoat Docker tren Ubuntu..." -ForegroundColor Green
ssh "$($UBUNTU_USER)@$($UBUNTU_IP)" "mkdir -p $($REMOTE_DIR) && tar -xzf ~/shop.tar.gz -C $($REMOTE_DIR) && rm ~/shop.tar.gz && cd $($REMOTE_DIR) && (docker-compose up -d --build || docker compose up -d --build)"

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host " 🎉 DEPLOY THANH CONG!" -ForegroundColor Green
Write-Host " 🌐 Truy cap trang web tai: http://$UBUNTU_IP" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
