$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$jsonPath = Join-Path $projectRoot 'data.json'
$scriptPath = Join-Path $projectRoot 'data.js'

$data = Get-Content -LiteralPath $jsonPath -Raw | ConvertFrom-Json -Depth 100
$compactJson = $data | ConvertTo-Json -Depth 100 -Compress
$generated = "// Generated from data.json by data/build-data.ps1.`nwindow.RUMBLE_DATA=$compactJson;`n"
Set-Content -LiteralPath $scriptPath -Value $generated -Encoding utf8NoBOM

Write-Host "Generated $scriptPath from $jsonPath"
