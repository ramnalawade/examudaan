# ==============================================================================
# setup_venv.ps1
# Script to create a Python 3.14 virtual environment and install dependencies
# ==============================================================================

$ErrorActionPreference = "Stop"

# Get root directory of the script
$RootDir = $PSScriptRoot
if (-not $RootDir) { $RootDir = Get-Location }

$VenvPath = Join-Path $RootDir "apps/scraper/.venv"
$RequirementsPath = Join-Path $RootDir "apps/scraper/requirements.txt"

Write-Host "Locating Python 3.14..." -ForegroundColor Cyan

$PythonCmd = ""
if (Get-Command "py" -ErrorAction SilentlyContinue) {
    & py -3.14 -c "import sys" 2>$null
    if ($LASTEXITCODE -eq 0) {
        $PythonCmd = "py -3.14"
        Write-Host "Found Python 3.14 via Python Launcher (py -3.14)" -ForegroundColor Green
    }
}

if (-not $PythonCmd -and (Get-Command "python" -ErrorAction SilentlyContinue)) {
    $Version = & python --version 2>&1
    if ($Version -match "3\.14") {
        $PythonCmd = "python"
        Write-Host "Found Python 3.14 via python command" -ForegroundColor Green
    }
}

if (-not $PythonCmd) {
    Write-Error "Python 3.14 was not found on your system."
    Write-Host "Please run .\install_python.ps1 first to install Python 3.14." -ForegroundColor Yellow
    Exit 1
}

Write-Host "`nCreating virtual environment at: $VenvPath" -ForegroundColor Cyan
if (Test-Path $VenvPath) {
    Write-Host "Virtual environment already exists at $VenvPath. Re-using..." -ForegroundColor Yellow
} else {
    # Run venv module
    if ($PythonCmd -eq "py -3.14") {
        & py -3.14 -m venv $VenvPath
    } else {
        & python -m venv $VenvPath
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Virtual environment created successfully." -ForegroundColor Green
    } else {
        Write-Error "Failed to create virtual environment."
        Exit 1
    }
}

$PipPath = Join-Path $VenvPath "Scripts/pip.exe"
if (Test-Path $PipPath) {
    Write-Host "`nUpgrading pip, setuptools, and wheel in the virtual environment..." -ForegroundColor Cyan
    & $PipPath install --upgrade pip setuptools wheel
    
    if (Test-Path $RequirementsPath) {
        Write-Host "`nInstalling dependencies from: $RequirementsPath..." -ForegroundColor Cyan
        & $PipPath install -r $RequirementsPath
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nAll scraper dependencies installed successfully!" -ForegroundColor Green
        } else {
            Write-Warning "Some dependencies failed to install. Please check errors above."
        }
    } else {
        Write-Warning "requirements.txt not found at $RequirementsPath"
    }
} else {
    Write-Error "pip executable not found in the virtual environment at: $PipPath"
    Exit 1
}

# Provide activation instructions
$RelativeVenvPath = "apps/scraper/.venv"
Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host "Virtual environment setup complete!" -ForegroundColor Green
Write-Host "To activate this virtual environment in PowerShell, run:" -ForegroundColor Cyan
Write-Host "  . \$RelativeVenvPath\Scripts\Activate.ps1" -ForegroundColor Yellow
Write-Host "To activate in Command Prompt, run:" -ForegroundColor Cyan
Write-Host "  $RelativeVenvPath\Scripts\activate.bat" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
