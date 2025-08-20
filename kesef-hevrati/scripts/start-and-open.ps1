param(
    [string]$Path = "/community",
    [int[]]$Ports = @(3001,3000,3010),
    [int]$TimeoutSec = 60
)

function Test-Port($hostName, $port) {
    try {
        $r = Test-NetConnection -ComputerName $hostName -Port $port -WarningAction SilentlyContinue
        return $r.TcpTestSucceeded
    } catch {
        return $false
    }
}

$loopHost = "127.0.0.1"
$found = $null
foreach ($p in $Ports) {
    Write-Host "Checking port $p..."
    if (Test-Port $loopHost $p) {
        $found = $p
        break
    }
}

if ($found) {
    $url = "http://$($loopHost):$found$Path"
    Write-Host "Found running server. Opening $url"
    Start-Process $url
    exit 0
}

# No server running; start the dev server (prefer dev:3001)
Write-Host "No running server found on $($Ports -join ', '). Starting dev:3001..."
$startCmd = "npm run dev:3001"
# Start in a new PowerShell process so it keeps running after this script exits
Start-Process -FilePath "powershell" -ArgumentList "-NoProfile","-ExecutionPolicy","Bypass","-Command","$startCmd" -WorkingDirectory (Get-Location) -WindowStyle Minimized

$deadline = (Get-Date).AddSeconds($TimeoutSec)
while ((Get-Date) -lt $deadline) {
    foreach ($p in $Ports) {
        if (Test-Port $loopHost $p) {
            $found = $p
            break
        }
    }
    if ($found) { break }
    Start-Sleep -Seconds 1
}

if ($found) {
    $url = "http://$($loopHost):$found$Path"
    Write-Host "Dev server is up on port $found. Opening $url"
    Start-Process $url
    exit 0
} else {
    Write-Host "Timed out waiting for dev server to start. Check the terminal where 'npm run dev:3001' is running for errors."
    exit 1
}
