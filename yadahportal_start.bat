@echo off
REM =================================================
REM YadahPortal Startup Script - MongoDB in Docker
REM Next.js runs locally
REM =================================================

SET PROJECT_DIR=C:\ServerApps\yadahportal
SET LOG_FILE=%USERPROFILE%\yadahportal_local.log

cd /d %PROJECT_DIR%

REM ----------------------------
REM 1. Ensure Docker Desktop is running
REM ----------------------------
echo Checking if Docker is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Waiting for Docker to initialize...
    timeout /t 30 >nul
    docker info >nul 2>&1
    if errorlevel 1 (
        echo Docker did not start. Please start Docker manually.
        pause
        exit /b 1
    )
)
echo Docker is running.

REM ----------------------------
REM 2. Start MongoDB container
REM ----------------------------
echo Starting MongoDB container...
docker-compose up -d >> "%LOG_FILE%" 2>&1

REM ----------------------------
REM 3. Wait for MongoDB to become healthy
REM ----------------------------
echo Waiting for MongoDB to become healthy...
:WAIT_MONGO
docker inspect --format='{{.State.Health.Status}}' yadah-mongo 2>nul | find "healthy" >nul
if errorlevel 1 (
    timeout /t 5 >nul
    goto WAIT_MONGO
)
echo MongoDB is healthy.

REM ----------------------------
REM 4. Install Node.js dependencies if needed
REM ----------------------------
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm ci >> "%LOG_FILE%" 2>&1
) else (
    echo Node.js dependencies already installed. Skipping...
)

REM ----------------------------
REM 5. Build Next.js project if needed
REM ----------------------------
if not exist ".next" (
    echo Building Next.js project...
    npm run build >> "%LOG_FILE%" 2>&1
) else (
    echo Next.js build already exists. Skipping...
)

REM ----------------------------
REM 6. Start Next.js locally
REM ----------------------------
echo Starting Next.js locally...
start "" npm run start >> "%LOG_FILE%" 2>&1

echo All services started. Logs are at %LOG_FILE%
pause
