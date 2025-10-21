## 1️⃣ Organize Your Project

1. Create a dedicated folder for your server apps:

   C:\ServerApps

2. Place your Next.js project inside:

   C:\ServerApps\yadahportal

3. Make sure your .env file (or environment variables) is correctly set for production:

   NEXT_PUBLIC_API_URL=http://10.109.28.200:80/api
   DATABASE_URI=mongodb://localhost:27017/yadah
   NODE_ENV=production

---

## 2️⃣ Install Node.js and npm

1. Download and install Node.js (LTS) from [https://nodejs.org](https://nodejs.org).
2. Make sure Node.js is added to your PATH (the installer usually does this).
3. Verify installation in Command Prompt:

   node -v
   npm -v

---

## 3️⃣ Install PM2 globally

Open Command Prompt as Administrator:

npm install -g pm2

Verify:

pm2 -v

---

## 4️⃣ Ensure MongoDB Service is Installed

1. If MongoDB is installed via the Windows installer, it usually runs as a service named MongoDB.
2. Check the service in PowerShell or CMD:

   sc query MongoDB

3. If it’s not installed, download MongoDB Community Edition and install as a Windows Service.

---

## 5️⃣ Prepare the Startup Script

1. Create yadahportalstartup.bat in your project directory:

   C:\ServerApps\yadahportal\yadahportalstartup.bat

---

## 6️⃣ Test the Script Manually

In Command Prompt as Administrator, run:

cd C:\ServerApps\yadahportal
yadahportalstartup.bat

✅ Verify that:

- MongoDB service starts (or is already running).
- Next.js app builds (if not already built).
- PM2 starts your app and shows online when you run:

  pm2 status

- Logs are written to %PROJECT_DIR%\pm2_yadah.log.

---

## 7️⃣ Configure PM2 to Auto-start on Windows Boot

Run as Administrator:

pm2 save
pm2 startup

- Copy the command PM2 outputs and run it once.
- This ensures PM2 resurrects your app on reboot.

---

## 8️⃣ Add Script to Windows Startup (Optional Extra)

- Press Win + R → shell:startup → place a shortcut to yadahportalstartup.bat in this folder.
- This ensures your script runs even if PM2 didn’t automatically resurrect (double redundancy).

---

## 9️⃣ Set Static IP and Firewall Rules

1. Set your Windows PC to a static IP in your LAN (e.g., 10.109.28.200).
2. Open port 80 in the firewall:

   netsh advfirewall firewall add rule name="NextJS Port 80" dir=in action=allow protocol=TCP localport=80

3. Now your Next.js frontend + API is accessible at:

   http://10.109.28.200

---

## 10️⃣ Verify Everything

1. Open a browser → go to http://10.109.28.200 → your portal should load.
2. Check PM2 logs:

   pm2 logs yadah-portal

3. Check MongoDB service:

   sc query MongoDB
