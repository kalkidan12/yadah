@echo off
REM =================================================
REM MongoDB Backup Script for YadahPortal (Docker) + Google Drive Upload
REM =================================================

REM ---- Config ----
SET BACKUP_DIR=C:\ServerApps\YadahDB_Backups
SET CONTAINER_NAME=yadah-mongo
SET DB_NAME=yadah
SET GDRIVE_REMOTE=gdrive
SET GDRIVE_FOLDER=YadahDB_Backups

REM ---- Clean Timestamp: Replaces space in hour with '0' (e.g., " 9" -> "09") ----
REM Replace all spaces in TIME variable with zeros before using it
SET "CLEAN_TIME=%TIME: =0%"
SET "TIMESTAMP=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%_%CLEAN_TIME:~0,2%%CLEAN_TIME:~3,2%%CLEAN_TIME:~6,2%"

REM ---- Create backup folder if it does not exist ----
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
echo Starting MongoDB backup at %TIMESTAMP%...

REM ---- Run mongodump inside Docker (Quoted to handle spaces/special chars) ----
docker exec "%CONTAINER_NAME%" mongodump --db "%DB_NAME%" --out "/data/backup/%TIMESTAMP%"

REM ---- Copy backup from container to host ----
docker cp "%CONTAINER_NAME%:/data/backup/%TIMESTAMP%" "%BACKUP_DIR%\%TIMESTAMP%"

echo Backup completed: "%BACKUP_DIR%\%TIMESTAMP%"

REM ---- Upload to Google Drive using rclone ----
echo Uploading backup to Google Drive...
REM FIX: Append %TIMESTAMP% to the destination path to create the dated sub-folder
rclone copy "%BACKUP_DIR%\%TIMESTAMP%" %GDRIVE_REMOTE%:%GDRIVE_FOLDER%/%TIMESTAMP% --progress

echo Backup and upload completed.
pause