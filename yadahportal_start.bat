@echo off
REM =================================================
REM YadahPortal Full Startup Script (Windows 10)
REM No PM2, single BAT file
REM =================================================

REM ----------------------------
REM 1. Set paths
REM ----------------------------
SET PROJECT_DIR=C:\ServerApps\yadahportal
SET LOG_FILE=%USERPROFILE%\yadahportal.log

cd /d %PROJECT_DIR%

REM ----------------------------
REM 2. Start MongoDB if not running
REM ----------------------------
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo Starting MongoDB service...
    net start MongoDB
    REM Wait a few seconds for MongoDB to start
    timeout /t 5 /nobreak >nul
) else (
    echo MongoDB is already running.
)

REM ----------------------------
REM 3. Install Node.js dependencies if missing
REM ----------------------------
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm install
) else (
    echo Dependencies already installed.
)

REM ----------------------------
REM 4. Build Next.js production app if not built
REM ----------------------------
if not exist ".next" (
    echo Building Next.js production app...
    npm run build
) else (
    echo Production build already exists.
)

REM ----------------------------
REM 5. Start Next.js in a loop for auto-restart
REM ----------------------------
echo Starting Next.js server...
:START_APP
echo [%date% %time%] Launching Next.js >> "%LOG_FILE%"
npm start >> "%LOG_FILE%" 2>&1
echo [%date% %time%] Next.js crashed, restarting in 5 seconds... >> "%LOG_FILE%"
timeout /t 5 /nobreak >nul
goto START_APP
