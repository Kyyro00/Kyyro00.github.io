#!/usr/bin/env pwsh
# Script de despliegue: añade, commitea y push al remoto `origin/main`.
$ErrorActionPreference = 'Stop'
$repoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoDir

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "Git no está disponible en la ruta. Instala Git y vuelve a intentarlo."
  exit 1
}

$defaultMsg = "Site update"
$msg = Read-Host "Mensaje de commit (Enter para '$defaultMsg')"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = $defaultMsg }

Write-Output "Agregando cambios..."
git add .

Write-Output "Creando commit..."
try {
  git commit -m "$msg" | Out-Null
} catch {
  $output = $_.Exception.Message
  if ($output -match "nothing to commit") {
    Write-Output "No hay cambios para commitear. No se realizará push."
    exit 0
  } else {
    Write-Error "Error al crear commit: $output"
    exit 1
  }
}

Write-Output "Enviando a origin/main..."
git push origin main
if ($LASTEXITCODE -ne 0) {
  Write-Error "Error al hacer push. Comprueba tus credenciales y configuración remota."
  exit 1
}

Write-Output "Despliegue completado. Abriendo site..."
Start-Process "https://Kyyro00.github.io"

Write-Output "La página ya se actualizó. Tiempo restante para ver el cambio:"
for ($remaining = 120; $remaining -ge 1; $remaining--) {
  Write-Host ("Tiempo restante: {0} segundos" -f $remaining) -NoNewline
  Start-Sleep -Seconds 1
  Write-Host "`r" -NoNewline
}
Write-Host "Tiempo restante: 0 segundos"
exit 0
