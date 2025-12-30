# CareerBoost - Quick Start Script
# Run this to start the entire application

Write-Host "🚀 Starting CareerBoost..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js detected: $(node --version)" -ForegroundColor Green

# Get current directory
$ROOT_DIR = $PSScriptRoot

# Backend setup
Write-Host ""
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location "$ROOT_DIR\careerboost-backend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Gray
    npm install
}

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Gray
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please update DATABASE_URL in .env file!" -ForegroundColor Yellow
}

# Frontend setup
Write-Host ""
Write-Host "🎨 Setting up Frontend..." -ForegroundColor Yellow
Set-Location "$ROOT_DIR\careerboost-frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Gray
    npm install
}

# Start services
Write-Host ""
Write-Host "🚀 Starting services..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will start on:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend will start on: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both services" -ForegroundColor Gray
Write-Host ""

# Start backend in background
$backendPath = "$ROOT_DIR\careerboost-backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; Write-Host '🔧 Backend Server' -ForegroundColor Cyan; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
$frontendPath = "$ROOT_DIR\careerboost-frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; Write-Host '🎨 Frontend Server' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "✅ CareerBoost is starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Two PowerShell windows will open:" -ForegroundColor Cyan
Write-Host "  1. Backend server (Port 5000)" -ForegroundColor Gray
Write-Host "  2. Frontend server (Port 3000)" -ForegroundColor Gray
Write-Host ""
Write-Host "Your browser should automatically open http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 If you haven't set up the database yet:" -ForegroundColor Yellow
Write-Host "   1. Install PostgreSQL" -ForegroundColor Gray
Write-Host "   2. Update DATABASE_URL in careerboost-backend/.env" -ForegroundColor Gray
Write-Host "   3. Run: Set-Location careerboost-backend; npx prisma migrate dev" -ForegroundColor Gray
Write-Host ""
