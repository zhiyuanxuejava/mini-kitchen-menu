param(
  [string]$OutputRoot = 'release',
  [string]$BundleName = 'mini-kitchen-menu-linux-upload'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir '..\..')).Path
$outputDir = Join-Path $repoRoot $OutputRoot
$stageDir = Join-Path $outputDir $BundleName
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archivePath = Join-Path $outputDir "$BundleName-$timestamp.tar.gz"

function Invoke-Robocopy {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$Destination,
    [string[]]$ExcludeDirs = @(),
    [string[]]$ExcludeFiles = @()
  )

  $args = @($Source, $Destination, '/E', '/R:2', '/W:1', '/NFL', '/NDL', '/NJH', '/NJS', '/NP')

  if ($ExcludeDirs.Length -gt 0) {
    $args += '/XD'
    $args += $ExcludeDirs
  }

  if ($ExcludeFiles.Length -gt 0) {
    $args += '/XF'
    $args += $ExcludeFiles
  }

  & robocopy @args | Out-Null
  if ($LASTEXITCODE -ge 8) {
    throw "robocopy failed for $Source -> $Destination with exit code $LASTEXITCODE"
  }
}

if (!(Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir | Out-Null
}

if (Test-Path $stageDir) {
  Remove-Item -LiteralPath $stageDir -Recurse -Force
}

New-Item -ItemType Directory -Path $stageDir | Out-Null

$rootFiles = @(
  'package.json',
  'package-lock.json',
  'README.md'
)

foreach ($file in $rootFiles) {
  Copy-Item -LiteralPath (Join-Path $repoRoot $file) -Destination (Join-Path $stageDir $file)
}

Invoke-Robocopy -Source (Join-Path $repoRoot 'frontend') -Destination (Join-Path $stageDir 'frontend') `
  -ExcludeDirs @('node_modules', 'dist', '.vite', '.uni', 'unpackage') `
  -ExcludeFiles @('.env.local', 'project.config.json', 'project.private.config.json', 'manifest.json', '.h5-version.json')

Invoke-Robocopy -Source (Join-Path $repoRoot 'backend') -Destination (Join-Path $stageDir 'backend') `
  -ExcludeDirs @('node_modules', 'dist', 'uploads') `
  -ExcludeFiles @('.env', 'dev.db', 'dev.db-journal', 'dev.db-shm', 'dev.db-wal')

Invoke-Robocopy -Source (Join-Path $repoRoot 'admin') -Destination (Join-Path $stageDir 'admin') `
  -ExcludeDirs @('node_modules', 'dist', '.vite') `
  -ExcludeFiles @('.env')

Invoke-Robocopy -Source (Join-Path $repoRoot 'deploy') -Destination (Join-Path $stageDir 'deploy')
Invoke-Robocopy -Source (Join-Path $repoRoot 'scripts') -Destination (Join-Path $stageDir 'scripts')

New-Item -ItemType Directory -Path (Join-Path $stageDir 'output') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $repoRoot 'output\recipe-import-sources.json') -Destination (Join-Path $stageDir 'output\recipe-import-sources.json')

New-Item -ItemType Directory -Path (Join-Path $stageDir 'backend\uploads') -Force | Out-Null

if (Test-Path $archivePath) {
  Remove-Item -LiteralPath $archivePath -Force
}

Push-Location $outputDir
try {
  tar -czf $archivePath $BundleName
  if ($LASTEXITCODE -ne 0) {
    throw "tar failed with exit code $LASTEXITCODE"
  }
} finally {
  Pop-Location
}

Write-Output "Stage directory: $stageDir"
Write-Output "Archive: $archivePath"
