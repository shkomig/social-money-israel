param(
  [int]$Port = 3001
)

Write-Host "[dev-reset] Using port $Port" -ForegroundColor Cyan

# Kill any process listening on the chosen port
try {
  $conns = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($conns) {
    $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $pids) {
  try { Stop-Process -Id $pid -Force -ErrorAction Stop; Write-Host "[dev-reset] Killed PID ${pid}" -ForegroundColor Yellow } catch { Write-Host "[dev-reset] Failed to kill PID ${pid}: $($_.Exception.Message)" -ForegroundColor Red }
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

# Use npm.cmd directly
Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev:$Port" -WorkingDirectory $workDir -NoNewWindow

# Give server time to boot
Start-Sleep -Seconds 6

# Probe
try {
  $resp = (Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$Port/").StatusCode
  Write-Host "[dev-reset] GET / => $resp" -ForegroundColor Green
} catch {
  Write-Host "[dev-reset] Probe failed: $($_.Exception.Message)" -ForegroundColor Red
}

Pop-Location
