# ==============================================================================
# install_python.ps1
# Script to install Python 3.14 on Windows using winget
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "Checking if Python 3.14 is already installed..." -ForegroundColor Cyan

# Check if Python 3.14 is available via the python launcher
$PythonInstalled = $false
if (Get-Command "py" -ErrorAction SilentlyContinue) {
    & py -3.14 -c "import sys; print(sys.version)" 2>$null
    if ($LASTEXITCODE -eq 0) {
        $PythonInstalled = $true
        Write-Host "Python 3.14 is already installed and registered with the Python Launcher (py -3.14)." -ForegroundColor Green
    }
}

if (-not $PythonInstalled -and (Get-Command "python" -ErrorAction SilentlyContinue)) {
    $Version = & python --version 2>&1
    if ($Version -match "3\.14") {
        $PythonInstalled = $true
        Write-Host "Python 3.14 is already installed and available on PATH as 'python'." -ForegroundColor Green
    }
}

if ($PythonInstalled) {
    Write-Host "No installation needed. You are ready to create the virtual environment!" -ForegroundColor Green
    Exit 0
}

Write-Host "Python 3.14 was not found. Attempting to install via winget..." -ForegroundColor Cyan

if (-not (Get-Command "winget" -ErrorAction SilentlyContinue)) {
    Write-Error "winget is not installed or not available in the current environment."
    Write-Host "Please install Python 3.14 manually from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Exit 1
}

try {
    Write-Host "Running: winget install Python.Python.3.14 --exact --silent --accept-source-agreements --accept-package-agreements" -ForegroundColor Yellow
    & winget install Python.Python.3.14 --exact --silent --accept-source-agreements --accept-package-agreements
    
    Write-Host "`nPython 3.14 installation started/completed." -ForegroundColor Green
    Write-Host "IMPORTANT: You may need to restart your terminal/IDE for the changes to take effect." -ForegroundColor Yellow
}
catch {
    Write-Error "Failed to install Python 3.14 via winget: $_"
    Write-Host "Please download and install it manually from: https://www.python.org/downloads/release/python-3140/" -ForegroundColor Yellow
    Exit 1
}
