$urls = @(
    'https://social-money-israel.netlify.app/video/social-money_intro_30s_1080x1920.mp4',
    'https://social-money-israel.netlify.app/video/social-money_intro_30s_1080x1920.webm',
    'https://social-money-israel.netlify.app/video/social-money_intro_30s_1080x1920.he.vtt'
)

foreach ($u in $urls) {
    Write-Output "--- $u ---"
    try {
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 20
        $ct = $r.Headers['Content-Type']
        $cl = $r.Headers['Content-Length']
        Write-Output ("{0} - {1} - {2}" -f $r.StatusCode, ($ct -join ','), ($cl -join ','))
    } catch {
        Write-Output "ERROR: $($_.Exception.Message)"
    }
}
