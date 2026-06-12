$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logsDir = Join-Path $root '.logs'
$stateFile = Join-Path $logsDir 'dev-services.windows.json'
$escapedRoot = [regex]::Escape($root)

New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

$services = @(
  @{
    Name = 'backend'
    Port = 3001
    Command = 'npm.cmd'
    Arguments = @('run', 'dev:backend')
    HealthUrl = 'http://localhost:3001/health'
  },
  @{
    Name = 'admin'
    Port = 5174
    Command = 'npm.cmd'
    Arguments = @('run', 'dev:admin')
    HealthUrl = 'http://localhost:5174'
  },
  @{
    Name = 'frontend-h5'
    Port = 5173
    Command = 'npm.cmd'
    Arguments = @('run', 'dev:frontend:h5:lan')
    HealthUrl = 'http://localhost:5173'
  }
)

function Stop-ProcessTree {
  param([int]$ProcessId)

  if ($ProcessId -le 0) {
    return
  }

  $processes = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue)
  if (-not $processes) {
    return
  }

  $idsToKill = New-Object System.Collections.Generic.List[int]

  function Add-ProcessTreeIds {
    param(
      [int]$CurrentId,
      [object[]]$Snapshot,
      [System.Collections.Generic.List[int]]$Bucket
    )

    $children = @($Snapshot | Where-Object { $_.ParentProcessId -eq $CurrentId })
    foreach ($child in $children) {
      Add-ProcessTreeIds -CurrentId $child.ProcessId -Snapshot $Snapshot -Bucket $Bucket
    }

    if (-not $Bucket.Contains($CurrentId)) {
      $Bucket.Add($CurrentId)
    }
  }

  Add-ProcessTreeIds -CurrentId $ProcessId -Snapshot $processes -Bucket $idsToKill

  foreach ($id in $idsToKill) {
    try {
      Stop-Process -Id $id -Force -ErrorAction Stop
    } catch {
    }
  }
}

function Stop-RecordedServices {
  if (-not (Test-Path $stateFile)) {
    return
  }

  try {
    $state = Get-Content $stateFile -Raw | ConvertFrom-Json
    foreach ($name in $state.PSObject.Properties.Name) {
      $service = $state.$name
      if ($service.pid) {
        Stop-ProcessTree -ProcessId ([int]$service.pid)
      }
    }
  } catch {
  }
}

function Stop-ProcessOnPort {
  param([int]$Port)

  $connections = @(Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue)
  foreach ($connection in $connections) {
    Stop-ProcessTree -ProcessId $connection.OwningProcess
  }
}

function Stop-ProjectNodeProcesses {
  $processes = Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq 'node.exe' -and $_.CommandLine -and $_.CommandLine -match $escapedRoot
  }

  foreach ($process in $processes) {
    Stop-ProcessTree -ProcessId $process.ProcessId
  }
}

function Wait-ForUrl {
  param(
    [string]$Url,
    [int]$TimeoutSeconds = 30
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 | Out-Null
      return $true
    } catch {
      Start-Sleep -Milliseconds 800
    }
  }

  return $false
}

Stop-RecordedServices

foreach ($service in $services) {
  Stop-ProcessOnPort -Port $service.Port
}

Stop-ProjectNodeProcesses

$state = [ordered]@{}

foreach ($service in $services) {
  $stdout = Join-Path $logsDir "$($service.Name).out.log"
  $stderr = Join-Path $logsDir "$($service.Name).err.log"

  Remove-Item $stdout, $stderr -ErrorAction SilentlyContinue

  $process = Start-Process `
    -FilePath $service.Command `
    -ArgumentList $service.Arguments `
    -WorkingDirectory $root `
    -RedirectStandardOutput $stdout `
    -RedirectStandardError $stderr `
    -WindowStyle Hidden `
    -PassThru

  $state[$service.Name] = [ordered]@{
    pid = $process.Id
    port = $service.Port
    url = $service.HealthUrl
    out = $stdout
    err = $stderr
  }
}

foreach ($service in $services) {
  $ready = Wait-ForUrl -Url $service.HealthUrl
  if (-not $ready) {
    $state | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 $stateFile
    Write-Host "FAILED: $($service.Name) did not become ready. Check logs:" -ForegroundColor Red
    Write-Host "  $logsDir\$($service.Name).out.log"
    Write-Host "  $logsDir\$($service.Name).err.log"
    exit 1
  }
}

$state | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 $stateFile

Write-Host 'All services are running in background.' -ForegroundColor Green
foreach ($service in $services) {
  $item = $state[$service.Name]
  Write-Host ("{0,-12} pid={1,-8} url={2}" -f $service.Name, $item.pid, $item.url)
}

Write-Host ''
Write-Host 'LAN URLs:'
Write-Host '  backend  http://192.168.3.36:3001/health'
Write-Host '  admin    http://192.168.3.36:5174'
Write-Host '  h5       http://192.168.3.36:5173'
Write-Host ''
Write-Host "State file: $stateFile"
