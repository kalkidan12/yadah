@echo off
REM =================================================
REM MongoDB Backup Script for YadahPortal (Docker) + Google Drive Upload
REM Backup folder outside project: C:\ServerApps\YadahDB_Backups
REM =================================================

REM ---- Config ----
SET BACKUP_DIR=C:\ServerApps\YadahDB_Backups
SET TIMESTAMP=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
SET CONTAINER_NAME=yadah-mongo
SET DB_NAME=yadah
SET GDRIVE_REMOTE=gdrive
SET GDRIVE_FOLDER=YadahDB_Backups

REM ---- Create backup folder if it does not exist ----
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
echo Starting MongoDB backup at %TIMESTAMP%...

REM ---- Run mongodump inside Docker ----
docker exec %CONTAINER_NAME% mongodump --db %DB_NAME% --out /data/backup/%TIMESTAMP%

REM ---- Copy backup from container to host ----
docker cp %CONTAINER_NAME%:/data/backup/%TIMESTAMP% "%BACKUP_DIR%\%TIMESTAMP%"

echo Backup completed: %BACKUP_DIR%\%TIMESTAMP%

REM ---- Upload to Google Drive using rclone ----
echo Uploading backup to Google Drive...
rclone copy "%BACKUP_DIR%\%TIMESTAMP%" %GDRIVE_REMOTE%:%GDRIVE_FOLDER% --progress

echo Backup and upload completed.
pause
