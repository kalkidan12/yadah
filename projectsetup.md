# **Local Windows Server Setup Guide: Next.js + MongoDB + PM2**

This guide describes how to set up a Windows PC as a **LAN server** for a Next.js + MongoDB web application. The setup ensures:

- Automatic start on Windows boot
- Persistent PM2-managed app with crash recovery
- MongoDB runs as a Windows service
- LAN accessibility for other devices

---

## **1️⃣ Prerequisites**

1. **Windows 10/11 PC**
2. **Node.js** installed (preferably latest LTS)
3. **MongoDB Community Server** installed
4. **Git** (optional, for cloning project)
5. Internet access for installing npm packages

---

## **2️⃣ Configure Server PC Network**

1. **Assign a static LAN IP** so other devices can reliably access the server:

   **Option A: Via Windows Settings**

   - Open `Control Panel → Network and Sharing Center → Change adapter settings`.
   - Right-click your network → `Properties → Internet Protocol Version 4 (TCP/IPv4) → Properties`.
   - Select **“Use the following IP address”**:

     - IP: `192.168.1.100` (example)
     - Subnet mask: `255.255.255.0`
     - Default gateway: your router IP (`192.168.1.1`)

   - Save and test ping from another PC:

     ```
     ping 192.168.1.100
     ```

   **Option B: DHCP reservation on router** (recommended for professional setup)

   - Log in to your router → DHCP settings → reserve IP for server MAC address.

---

## **3️⃣ MongoDB Setup**

1. During installation, choose **“Install as a Windows Service”**.
2. Configure **Startup type → Automatic** in `services.msc`.
3. Start MongoDB service manually the first time if it’s not running:

   ```
   net start MongoDB
   ```

✅ MongoDB now starts automatically at Windows boot.

---

## **4️⃣ Next.js Application Setup**

1. Navigate to your project directory:

   ```bash
   cd C:\ServerApps\yadah
   ```

2. Ensure your `package.json` has the **LAN-ready start script**:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start -p 8080 -H 0.0.0.0",
  "lint": "next lint"
}
```

**Explanation:**

- `-p 8080` → server runs on port **8080**
- `-H 0.0.0.0` → binds to all network interfaces → accessible by other LAN devices

---

## **5️⃣ Install PM2 and Configure App Management**

1. Install PM2 globally:

```bash
npm install -g pm2
```

2. Start your Next.js app via PM2:

```bash
pm2 start npm --name "yadah" -- start
```

3. Save PM2 process list for resurrection:

```bash
pm2 save
```

---

## **6️⃣ Configure PM2 Auto-start on Windows**

1. Install `pm2-windows-startup` globally:

```bash
npm install pm2-windows-startup -g
```

2. Install startup script:

```bash
pm2-startup install
```

- This ensures PM2 starts automatically on Windows boot and resurrects all saved apps.
- PM2 will also **auto-restart your app if it crashes**.

---

## **7️⃣ Testing LAN Access**

1. From any device on the same network, open a browser and access:

```
http://192.168.1.100:8080
```

2. Your Next.js app should load successfully.
3. Test MongoDB connections if required by your app.
