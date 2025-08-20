param(
  [int]$Port = 3001,
  [switch]$OpenBrowser,
  [string]$Url,
  [int]$TimeoutSec = 25,
  [string]$Script,
  [switch]$Prod
)

Write-Host "[dev-reset] Using port $Port" -ForegroundColor Cyan

# Kill any process listening on the chosen port
try {
  $conns = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($conns) {
    $procIds = $conns | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $procIds) {
      try {
        Stop-Process -Id $procId -Force -ErrorAction Stop
        Write-Host "[dev-reset] Killed PID ${procId}" -ForegroundColor Yellow
      } catch {
        Write-Host "[dev-reset] Failed to kill PID ${procId}: $($_.Exception.Message)" -ForegroundColor Red
      }
    }
  }
} catch { Write-Host "[dev-reset] Query connections failed: $($_.Exception.Message)" -ForegroundColor Red }

# Unset Next dev cache lock if stuck (optional, safe)
$nextCache = Join-Path $PSScriptRoot "..\.next"
if (Test-Path $nextCache) {
  try {
    Get-ChildItem -Path $nextCache -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
  } catch {}
}

# Start dev server
$workDir = (Resolve-Path (Join-Path $PSScriptRoot ".."))
Write-Host "[dev-reset] Starting dev server in $workDir" -ForegroundColor Cyan
Push-Location $workDir

# Prefer IPv4 127.0.0.1 to avoid IPv6/localhost quirks
$env:WATCHPACK_POLLING = 'true'

# Choose npm script to run
$scriptToRun = if ([string]::IsNullOrWhiteSpace($Script)) { "dev:$Port" } else { $Script }
$startScript = if ($Prod) { "start:$Port" } else { $scriptToRun }

# Build in prod mode, else just start dev
if ($Prod) {
  Write-Host "[dev-reset] Building production app..." -ForegroundColor Cyan
  & npm.cmd run build
}

# Use npm.cmd directly to start
Start-Process -FilePath "npm.cmd" -ArgumentList "run","$startScript" -WorkingDirectory $workDir -NoNewWindow

if (-not $Url -or [string]::IsNullOrWhiteSpace($Url)) { $Url = "http://127.0.0.1:$Port/" }

# Always probe the root to avoid triggering heavy route builds during startup
$probeUrl = "http://127.0.0.1:$Port/"

# Probe with retries until up or timeout
$deadline = (Get-Date).AddSeconds($TimeoutSec)
$up = $false
do {
  try {
    $resp = (Invoke-WebRequest -UseBasicParsing $probeUrl -TimeoutSec 5).StatusCode
    if ($resp -ge 200 -and $resp -lt 500) {
      $up = $true
      Write-Host "[dev-reset] GET $probeUrl => $resp" -ForegroundColor Green
      break
    }
  } catch {
    # Silent retry
  }
  Start-Sleep -Milliseconds 600
} while((Get-Date) -lt $deadline)

if (-not $up) {
  Write-Host "[dev-reset] Server not responding at $Url within ${TimeoutSec}s" -ForegroundColor Yellow
} elseif ($OpenBrowser) {
  try {
    Write-Host "[dev-reset] Opening browser: $Url" -ForegroundColor Cyan
    Start-Process $Url | Out-Null
  } catch {
    Write-Host "[dev-reset] Failed to open browser: $($_.Exception.Message)" -ForegroundColor Red
  }
}

Pop-Location
