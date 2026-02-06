# Startup Script for VEIL
Write-Host "🚀 Initializing VEIL System..." -ForegroundColor Cyan

# 1. Check Java
try {
    $javaVer = java -version 2>&1
    Write-Host "✅ Java detected" -ForegroundColor Green
}
catch {
    Write-Error "❌ JAVA NOT FOUND. Please install JDK 17+ and add to PATH."
    exit 1
}

# 2. Check Maven (Auto-Install)
$mvnCmd = "mvn"
if ((Get-Command "mvn" -ErrorAction SilentlyContinue) -eq $null) {
    Write-Host "⚠️ Maven not found globally. Checking local cache..." -ForegroundColor Yellow
    $LocalMavenDir = "$PSScriptRoot/backend/maven_dist"
    $LocalMavenBin = "$LocalMavenDir/apache-maven-3.9.9/bin/mvn.cmd"
    
    if (-not (Test-Path $LocalMavenBin)) {
        Write-Host "📥 Downloading Portable Maven (3.9.9)..." -ForegroundColor Cyan
        $MavenUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"
        $ZipPath = "$PSScriptRoot/backend/maven.zip"
        
        # Download
        Invoke-WebRequest -Uri $MavenUrl -OutFile $ZipPath
        
        # Extract
        Write-Host "📦 Extracting Maven..." -ForegroundColor Cyan
        Expand-Archive -Path $ZipPath -DestinationPath $LocalMavenDir -Force
        
        # Cleanup
        Remove-Item $ZipPath
    }
    
    $mvnCmd = $LocalMavenBin
    Write-Host "✅ Using Local Maven: $mvnCmd" -ForegroundColor Green
}
else {
    Write-Host "✅ Using Global Maven" -ForegroundColor Green
}

# 3. Check Node
try {
    $nodeVer = node -v 2>&1
    Write-Host "✅ Node.js detected: $nodeVer" -ForegroundColor Green
}
catch {
    Write-Error "❌ NODE.JS NOT FOUND."
    exit 1
}

# 4. Start Backend
Write-Host "🧠 Starting Backend Brain (Spring Boot)..." -ForegroundColor Yellow
$BackendProcess = Start-Process -FilePath $mvnCmd -ArgumentList "spring-boot:run" -WorkingDirectory "$PSScriptRoot/backend" -NoNewWindow -PassThru

# 5. Wait for Backend (Naive check)
Write-Host "⏳ Waiting 15s for Backend to boot..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# 6. Start Frontend
Write-Host "💻 Starting Frontend UI..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot"
try {
    npm run dev
}
finally {
    # Cleanup backend when frontend dies
    Stop-Process -Id $BackendProcess.Id -ErrorAction SilentlyContinue
}
