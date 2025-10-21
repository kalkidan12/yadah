Here’s your **updated README.md guide**, fully polished and adapted for your latest setup (Next.js + MongoDB + PM2, automatic startup on Windows, 0.0.0.0 binding):

---

## 1️⃣ Organize Your Project

1. Create a dedicated folder for your server apps:

   ```
   C:\ServerApps
   ```

2. Place your Next.js project inside:

   ```
   C:\ServerApps\yadahportal
   ```

3. Make sure your `.env` file (or environment variables) is correctly set for production:

   ```env
   NEXT_PUBLIC_API_URL=http://10.109.28.200:80/api
   DATABASE_URI=mongodb://localhost:27017/yadah
   NODE_ENV=production
   ```

---

## 2️⃣ Install Node.js and npm

1. Download and install Node.js (LTS) from [https://nodejs.org](https://nodejs.org).
2. Ensure Node.js is added to your PATH (installer usually does this).
3. Verify installation in Command Prompt:

   ```cmd
   node -v
   npm -v
   ```

---

## 3️⃣ Install PM2 Globally

Open Command Prompt as **Administrator**:

```cmd
npm install -g pm2
```

Verify installation:

```cmd
pm2 -v
```

---

## 4️⃣ Ensure MongoDB Service is Installed

1. If MongoDB is installed via the Windows installer, it usually runs as a service named `MongoDB`.

2. Check the service in PowerShell or CMD:

   ```cmd
   sc query MongoDB
   ```

3. If not installed, download MongoDB Community Edition and install it **as a Windows Service**.

---

## 5️⃣ Prepare the Startup Script

1. Create the startup script in your project directory:

   ```
   C:\ServerApps\yadahportal\yadahportalstartup.bat
   ```

2. Use this content (bind Next.js to all interfaces):

```bat
@echo off
SET PROJECT_DIR=C:\ServerApps\yadahportal
SET NEXT_HOST=0.0.0.0
SET NEXT_PORT=80
SET NODE_ENV=production
SET MONGO_SERVICE=MongoDB
SET LOG_FILE=%PROJECT_DIR%\pm2_yadah.log
SET PATH=C:\Program Files\nodejs;%PATH%

cd /d "%PROJECT_DIR%" || exit /b 1

sc query "%MONGO_SERVICE%" | find "RUNNING" >nul
IF %ERRORLEVEL% NEQ 0 (
    net start "%MONGO_SERVICE%" >nul
)

IF NOT EXIST "%PROJECT_DIR%\node_modules" (
    npm install --silent
)

IF NOT EXIST "%PROJECT_DIR%\.next" (
    npm run build --silent
)

where pm2 >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    npm install -g pm2
)

pm2 delete yadah-portal >nul 2>nul
pm2 start npm --name "yadah-portal" -- start -- -p %NEXT_PORT% -H %NEXT_HOST% --log "%LOG_FILE%"
pm2 save
```

---

## 6️⃣ Test the Script Manually

Run in Command Prompt as **Administrator**:

```cmd
cd C:\ServerApps\yadahportal
yadahportalstartup.bat
```

✅ Verify:

- MongoDB service starts (or is already running).
- Next.js app builds (if not already built).
- PM2 starts your app (`pm2 status`).
- Logs are written to `C:\ServerApps\yadahportal\pm2_yadah.log`.

---

## 7️⃣ Add Script to Windows Startup

1. Press `Win + R` → type:

   ```
   shell:startup
   ```

2. Place a **shortcut** to `yadahportalstartup.bat` in this folder.
   ✅ This ensures the portal starts automatically after boot.

---

## 8️⃣ Set Static LAN IP and Firewall Rules

1. Set your Windows PC to a **static LAN IP** (e.g., `192.168.0.100`) to ensure it never changes automatically.

2. Open port 80 in Windows Firewall:

   ```cmd
   netsh advfirewall firewall add rule name="NextJS Port 80" dir=in action=allow protocol=TCP localport=80
   ```

3. Your portal is now accessible on your LAN:

   ```
   http://192.168.0.100
   ```

> ⚠ Note: Since Next.js is bound to `0.0.0.0`, it will accept connections from all interfaces, including other devices on your LAN. Always use the static LAN IP to access it.

---

## 9️⃣ Verify Everything

1. Open a browser → go to:

   ```
   http://192.168.0.100
   ```

2. Check PM2 logs:

   ```cmd
   pm2 logs yadah-portal
   ```

3. Check MongoDB service:

   ```cmd
   sc query MongoDB
   ```

---

This guide ensures your **Next.js portal + MongoDB** runs automatically after Windows boot with no manual PM2 intervention, reachable from your LAN.

---

If you want, I can also **add a diagram showing the workflow from startup → MongoDB → Next.js → PM2 → browser access**, so it’s visually clear for future reference.

Do you want me to do that?
