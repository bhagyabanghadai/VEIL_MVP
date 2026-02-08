Write-Host "🚀 VEIL Rapid Fix Protocol Initiated..." -ForegroundColor Cyan

$root = Resolve-Path "$PSScriptRoot/.."
Set-Location $root

# 1. Install Python Dependencies
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Yellow
try {
    pip install fastapi uvicorn requests pydantic pydantic-settings
} catch {
    Write-Host "❌ Failed to install Python dependencies. Please ensure pip is in your PATH." -ForegroundColor Red
}

# 2. Start Backend
Write-Host "🧠 Starting Reflex Engine..." -ForegroundColor Green
try {
    # Kill existing python processes to avoid port conflicts (optional, safe for dev)
    # Stop-Process -Name "python" -ErrorAction SilentlyContinue 
    
    $backendProcess = Start-Process python -ArgumentList "-m core.reflex.main" -WorkingDirectory $root -PassThru
    if ($backendProcess) {
        Write-Host "✅ Backend Started (PID: $($backendProcess.Id))"
    } else {
        Write-Host "❌ Failed to start backend process." -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error starting backend: $_" -ForegroundColor Red
}

Write-Host "✨ Fix Complete. Please refresh your dashboard at http://localhost:3006" -ForegroundColor Cyan
Write-Host "   (If the dashboard is blank, wait 5 seconds for backend to initialize)" -ForegroundColor Gray
