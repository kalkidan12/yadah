@echo off
REM ===============================================================
REM  YADAH PORTAL FULL AUTOMATIC STARTUP SCRIPT (Windows-ready)
REM  Location: C:\ServerApps\yadahportal\yadahportalstartup.bat
REM  Purpose:  Start MongoDB + Next.js via PM2 on Windows boot
REM ===============================================================

REM -------- CONFIGURATION --------
SET PROJECT_DIR=C:\ServerApps\yadahportal
SET NEXT_HOST=0.0.0.0        
SET NEXT_PORT=80
SET NODE_ENV=production
SET MONGO_SERVICE=MongoDB
SET LOG_FILE=%PROJECT_DIR%\pm2_yadah.log

REM -------- ADD NODE.JS TO PATH --------
SET PATH=C:\Program Files\nodejs;%PATH%

echo.
echo =========================================================
echo Starting Yadah Portal Environment (Automatic Mode)
echo =========================================================
echo.

REM -------- NAVIGATE TO PROJECT DIRECTORY --------
cd /d "%PROJECT_DIR%" || (
    echo ERROR: Project directory not found: %PROJECT_DIR%
    pause
    exit /b 1
)

REM -------- START MONGODB SERVICE --------
echo Checking MongoDB service...
sc query "%MONGO_SERVICE%" | find "RUNNING" >nul
IF %ERRORLEVEL%==0 (
    echo MongoDB is already running.
) ELSE (
    echo Starting MongoDB service...
    net start "%MONGO_SERVICE%" >nul
    IF %ERRORLEVEL% NEQ 0 (
        echo ⚠ WARNING: Could not start MongoDB service. Make sure MongoDB is installed as a service.
    ) ELSE (
        echo MongoDB started successfully.
    )
)
echo.

REM -------- INSTALL DEPENDENCIES --------
IF NOT EXIST "%PROJECT_DIR%\node_modules" (
    echo Installing npm dependencies...
    npm install --silent
    IF ERRORLEVEL 1 (
        echo ERROR: npm install failed.
        pause
        exit /b 1
    )
)
echo.

REM -------- BUILD NEXT.JS (IF NOT BUILT) --------
IF NOT EXIST "%PROJECT_DIR%\.next" (
    echo Building Next.js project for production...
    npm run build --silent
    IF ERRORLEVEL 1 (
        echo ERROR: npm run build failed.
        pause
        exit /b 1
    )
)
echo.

REM -------- INSTALL PM2 IF MISSING --------
where pm2 >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Installing PM2 globally...
    npm install -g pm2
)
echo.

REM -------- STOP EXISTING PM2 INSTANCE --------
pm2 delete yadah-portal >nul 2>nul

REM -------- START NEXT.JS WITH PM2 --------
echo Starting Yadah Portal via PM2...
pm2 start npm --name "yadah-portal" -- start -- -p %NEXT_PORT% -H %NEXT_HOST% --log "%LOG_FILE%"
IF ERRORLEVEL 1 (
    echo ERROR: PM2 failed to start Next.js
    pause
    exit /b 1
)
pm2 save

REM -------- STATUS OUTPUT --------
echo.
echo =========================================================
echo YADAH PORTAL STARTED SUCCESSFULLY
echo Host: All interfaces (0.0.0.0) reachable via your LAN IP
echo Port: %NEXT_PORT%
echo Node Env: %NODE_ENV%
echo PM2 Logs: %LOG_FILE%
echo =========================================================
echo.

exit /b 0
