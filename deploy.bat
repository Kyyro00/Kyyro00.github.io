@echo off
REM Lanzador para deploy.ps1 — doble clic desde el Explorador
SET SCRIPT_DIR=%~dp0
powershell -ExecutionPolicy Bypass -NoProfile -File "%SCRIPT_DIR%deploy.ps1"
PAUSE
