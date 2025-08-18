param(
    [string]$Path = "/community",
    [int[]]$Ports = @(3001,3000,3010,3002)
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
    Write-Host "Opening $url"
    Start-Process $url
} else {
    Write-Host "No server detected on ports: $($Ports -join ', '). You can start the dev server with 'npm run dev' or 'npm run dev:3001' in the project folder."
}
