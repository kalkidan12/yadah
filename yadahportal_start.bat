@echo off
REM =================================================
REM YadahPortal Startup Script - Docker Version (Windows 10)
REM Auto-start Docker, MongoDB, and Next.js app
REM =================================================

SET PROJECT_DIR=C:\ServerApps\yadahportal
SET LOG_FILE=%USERPROFILE%\yadahportal_docker.log

cd /d %PROJECT_DIR%

REM ----------------------------
REM 1. Ensure Docker Desktop is running
REM ----------------------------
echo Checking if Docker is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Attempting to start Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Waiting for Docker to initialize...
    timeout /t 20 >nul
    docker info >nul 2>&1
    if errorlevel 1 (
        echo Docker did not start. Please start Docker Desktop manually.
        pause
        exit /b 1
    )
)
echo Docker is running.

REM ----------------------------
REM 2. Build and start Docker services
REM ----------------------------
echo Building Docker images...
docker-compose build >> "%LOG_FILE%" 2>&1

echo Starting Docker containers...
docker-compose up -d >> "%LOG_FILE%" 2>&1

REM ----------------------------
REM 3. Wait for MongoDB to be ready
REM ----------------------------
echo Waiting for MongoDB to become healthy...
:WAIT_MONGO
docker exec yadah-mongo mongo --eval "db.adminCommand('ping')" >nul 2>&1
if errorlevel 1 (
    timeout /t 5 >nul
    goto WAIT_MONGO
)
echo MongoDB is ready.

REM ----------------------------
REM 4. Show live logs
REM ----------------------------
echo All services started. Streaming logs to console and log file...
docker-compose logs -f >> "%LOG_FILE%" 2>&1
