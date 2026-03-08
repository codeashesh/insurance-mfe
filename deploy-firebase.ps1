# deploy-firebase.ps1 — Build all apps and deploy to Firebase Hosting (Windows)
# Usage: .\deploy-firebase.ps1

$ErrorActionPreference = "Stop"
$env:Path = "$env:APPDATA\npm;$env:Path"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SecureLife Insurance - Firebase Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Step 1: Install dependencies
Write-Host "[1/5] Installing dependencies..." -ForegroundColor Yellow
Set-Location "$RootDir\mfe-policy-dashboard"
npm install --silent
Set-Location "$RootDir\mfe-premium-payment"
npm install --silent
Set-Location "$RootDir\container"
npm install --silent

# Step 2: Build MFE 1
Write-Host ""
Write-Host "[2/5] Building MFE 1 - Policy Dashboard..." -ForegroundColor Yellow
Set-Location "$RootDir\mfe-policy-dashboard"
npm run build

# Step 3: Build MFE 2
Write-Host ""
Write-Host "[3/5] Building MFE 2 - Premium Payment..." -ForegroundColor Yellow
Set-Location "$RootDir\mfe-premium-payment"
npm run build

# Step 4: Build Container (production mode — uses Firebase URLs for remotes)
Write-Host ""
Write-Host "[4/5] Building Container App (production)..." -ForegroundColor Yellow
Set-Location "$RootDir\container"
$env:NODE_ENV = "production"
npm run build
$env:NODE_ENV = $null

# Step 5: Deploy to Firebase
Write-Host ""
Write-Host "[5/5] Deploying to Firebase Hosting..." -ForegroundColor Yellow
Set-Location $RootDir
firebase deploy --only hosting

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Container:        https://insurance-mfe.web.app" -ForegroundColor White
Write-Host "  Policy Dashboard: https://insurance-mfe-policy.web.app" -ForegroundColor White
Write-Host "  Premium Payment:  https://insurance-mfe-payment.web.app" -ForegroundColor White
Write-Host ""
