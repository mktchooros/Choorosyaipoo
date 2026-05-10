$port = if ($env:PORT) { $env:PORT } else { 8000 }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running on http://localhost:$port"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $path = $request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    
    $filePath = Join-Path (Get-Location) $path.TrimStart("/")
    
    if (Test-Path $filePath -PathType Leaf) {
        $response.ContentType = if ($path.EndsWith(".html")) { "text/html" }
                               elseif ($path.EndsWith(".css")) { "text/css" }
                               elseif ($path.EndsWith(".js")) { "application/javascript" }
                               elseif ($path.EndsWith(".jsx")) { "application/javascript" }
                               elseif ($path.EndsWith(".png")) { "image/png" }
                               else { "text/plain" }
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    
    $response.Close()
}
