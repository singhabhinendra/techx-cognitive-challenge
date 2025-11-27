<#
Runs a full-stack E2E test locally.

Requirements:
- Docker Desktop running (to provide a MongoDB container), or set MONGO_URI to an existing Mongo instance.
- PowerShell on Windows.

Usage:
  Open PowerShell at the repo root and run:
    .\scripts\run-e2e.ps1

This script will:
- Start a Mongo container named `techx-mongo` (if Docker available)
- Install server and client dependencies (npm ci)
- Start the server and client dev servers in the background
- Wait for both endpoints to be available and run Playwright E2E
- Clean up the background processes and stop the Mongo container
#>

Set-StrictMode -Version Latest

function Ensure-DockerRunning {
  try {
    docker info > $null 2>&1
    return $true
  } catch {
    return $false
  }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
Set-Location $repoRoot

Write-Host "Starting full-stack E2E runner from:`n $repoRoot" -ForegroundColor Cyan

$dockerAvailable = Ensure-DockerRunning
if ($dockerAvailable) {
  Write-Host "Starting MongoDB container (techx-mongo)..."
  docker run -d --rm -p 27017:27017 --name techx-mongo mongo:6.0 | Out-Null
  Start-Sleep -Seconds 2
} else {
  Write-Host "Docker not available. Falling back to in-memory MongoDB (USE_MEM_DB=1)." -ForegroundColor Yellow
  $env:USE_MEM_DB = '1'
}

# Start server
Write-Host "Installing server dependencies and starting server..."
Push-Location "$repoRoot\server"
# Use cmd to invoke npm/node to avoid PowerShell script wrapper issues
  cmd /c npm ci
$env:MONGO_URI = $env:MONGO_URI -or 'mongodb://localhost:27017/techx_e2e'
$serverProc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','node src/index.js' -WorkingDirectory (Get-Location) -PassThru
Write-Host "Server started (PID: $($serverProc.Id))"
Pop-Location

# Start client
Write-Host "Installing client dependencies and starting dev server..."
Push-Location "$repoRoot\client"
# Use cmd to run npm to avoid PowerShell wrapper issues
  # use npm install for client to avoid package-lock mismatches when running locally
  cmd /c npm install --no-audit --no-fund
$env:VITE_API_BASE = $env:VITE_API_BASE -or 'http://localhost:4000'
$clientProc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm run dev' -WorkingDirectory (Get-Location) -PassThru
Write-Host "Client dev server started (PID: $($clientProc.Id))"
Pop-Location

# Wait for services
Write-Host "Waiting for server and client to be ready..."
cmd /c "npx --yes wait-on http://localhost:4000 http://localhost:5173"

# Install Playwright browsers and run tests
Write-Host "Ensuring Playwright browsers are installed..."
Push-Location "$repoRoot\client"
cmd /c "npx --yes playwright install --with-deps"

Write-Host "Running Playwright E2E tests..."
cmd /c "npm run test:e2e"
$testExit = $LASTEXITCODE
Pop-Location

Write-Host "E2E finished with exit code $testExit"

# Cleanup
Write-Host "Cleaning up background processes and Docker container..."
try { if ($clientProc -and !$clientProc.HasExited) { Stop-Process -Id $clientProc.Id -Force } } catch {}
try { if ($serverProc -and !$serverProc.HasExited) { Stop-Process -Id $serverProc.Id -Force } } catch {}
if ($dockerAvailable) {
  docker stop techx-mongo | Out-Null
}

if ($testExit -ne 0) { exit $testExit } else { exit 0 }
