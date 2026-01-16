@echo off
echo ========================================
echo Starting MatchDays Development Servers
echo ========================================
echo.

echo [1/2] Starting Backend (Marketplace-Backend)...
start "Backend Server" cmd /k "cd C:\Users\Mateu\Desktop\Marketplace-Backend && npm start"
timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend (Matchdaysproject-new)...
start "Frontend Server" cmd /k "cd C:\Users\Mateu\Desktop\Programowanie i projekty\Matchdaysproject-new && npm run dev"

echo.
echo ========================================
echo Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3001
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
