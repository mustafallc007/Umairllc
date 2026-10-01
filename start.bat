@echo off
title TestLab Local Server
echo Starting TestLab server...
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
