@echo off
setlocal enabledelayedexpansion

echo Starting login test for pedermo user...
echo This script will attempt login every 2 minutes

:LOOP
echo.
echo [%date% %time%] Attempting login as pedermo...

curl -X POST "http://localhost:5000/api/auth/login" ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"pedermo@sinamoa.com\",\"password\":\"ChemicalReaction42!\"}" ^
     --silent --show-error --output login_result.json

if %errorlevel% equ 0 (
    echo Login attempt completed. Check login_result.json for response.
    type login_result.json
) else (
    echo Login attempt failed with error code: %errorlevel%
)

echo Waiting 2 minutes before next attempt...
timeout /t 120 /nobreak > nul

goto LOOP