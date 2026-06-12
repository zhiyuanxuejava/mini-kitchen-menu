$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logsDir = Join-Path $root '.logs'
$stateFile = Join-Path $logsDir 'dev-services.windows.json'
$ports = @(3001, 5173, 5174)
$escapedRoot = [regex]::Escape($root)

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

function Stop-ProjectNodeProcesses {
  while ($true) {
    $processes = @(Get-CimInstance Win32_Process | Where-Object {
      $_.Name -eq 'node.exe' -and $_.CommandLine -and $_.CommandLine -match $escapedRoot
    })

    if (-not $processes.Count) {
      break
    }

    foreach ($process in $processes) {
      try {
        Stop-Process -Id $process.ProcessId -Force -ErrorAction Stop
      } catch {
      }
    }

    Start-Sleep -Milliseconds 500
  }
}

if (Test-Path $stateFile) {
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

foreach ($port in $ports) {
  $connections = @(Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue)
  foreach ($connection in $connections) {
    Stop-ProcessTree -ProcessId $connection.OwningProcess
  }
}

Stop-ProjectNodeProcesses

Remove-Item $stateFile -ErrorAction SilentlyContinue

Write-Host 'Stopped backend/admin/frontend-h5 services if they were running.' -ForegroundColor Green
