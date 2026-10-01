$port = 8080
$prefix = "http://localhost:$port/"
$folder = $PSScriptRoot

if (-not $folder) {
    $folder = Get-Location
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host " TestLab Local Web Server Running!" -ForegroundColor Green
    Write-Host " Serving at: $prefix" -ForegroundColor Yellow
    Write-Host " Directory:  $folder" -ForegroundColor Gray
    Write-Host " Press Ctrl+C in this terminal to stop." -ForegroundColor Gray
    Write-Host "==========================================" -ForegroundColor Cyan

    Start-Process $prefix
} catch {
    Write-Host "Port $port might be busy or permission was denied. Trying port 8081..." -ForegroundColor Yellow
    $port = 8081
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    Write-Host " Serving at: $prefix" -ForegroundColor Green
    Start-Process $prefix
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $req = $context.Request
            $res = $context.Response

            $rawPath = $req.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($rawPath)) {
                $rawPath = "index.html"
            }

            # Normalize path
            $rawPath = $rawPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = Join-Path $folder $rawPath

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = "application/octet-stream"
                if ($mimeTypes.ContainsKey($ext)) {
                    $contentType = $mimeTypes[$ext]
                }

                $res.ContentType = $contentType
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $res.ContentLength64 = $bytes.Length
                $res.StatusCode = 200

                if ($req.HttpMethod -ne "HEAD") {
                    $res.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $res.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
                $res.ContentLength64 = $errBytes.Length
                if ($req.HttpMethod -ne "HEAD") {
                    $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
            }
        } catch {
            # Catch any client stream disconnect or write error and continue serving
        } finally {
            try { $context.Response.OutputStream.Close() } catch {}
        }
    }
} finally {
    try { $listener.Stop() } catch {}
    try { $listener.Close() } catch {}
}
