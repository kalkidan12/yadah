## **Step 1: Find your PC’s MAC Address**

The MAC address is a unique identifier for your network adapter.

### **1️⃣ Open Command Prompt**

- Press `Win + R`, type `cmd`, and press Enter.

### **2️⃣ Run the command**

```bash
ipconfig /all
```

### **3️⃣ Find your network adapter**

- Look for your **active adapter** (Wi-Fi or Ethernet)
- Find the line labeled **Physical Address**. Example:

```
Wireless LAN adapter Wi-Fi:
   Description . . . . . . . . . . : Intel Dual Band Wireless
   Physical Address. . . . . . . . : 12-34-56-78-9A-BC
   IPv4 Address. . . . . . . . . . : 192.168.1.105
```

- The **Physical Address** (e.g., `12-34-56-78-9A-BC`) is your **MAC address**.

---

## **Step 2: Log in to your router**

1. Open a web browser.
2. Enter your router’s IP address (usually the **gateway** shown in `ipconfig`):

```
Default Gateway . . . . . . . . . : 192.168.1.1
```

3. Enter the router username and password.

   - Default credentials are often on a sticker or in the manual.
   - Example: `admin / admin` or `admin / password`.

---

## **Step 3: Find DHCP Reservation / Static Lease Section**

- This varies by router brand, but usually under:
  **LAN Settings**, **DHCP Settings**, **Address Reservation**, or **Static Leases**.
- Look for a section that allows you to **bind an IP to a MAC address**.

---

## **Step 4: Reserve an IP for your PC**

1. Click **Add / Reserve / Create new**.
2. Enter:

   - **MAC Address** → from Step 1 (`12-34-56-78-9A-BC`)
   - **IP Address** → the IP you want to assign permanently, e.g., `192.168.1.100`
   - **Device Name** → optional (e.g., `ServerPC`)

3. Save / Apply the settings.

---

## **Step 5: Reconnect your PC**

- Disconnect and reconnect your PC to the network (Wi-Fi or Ethernet).
- Verify the assigned IP using `ipconfig` — it should now be the reserved IP (`192.168.1.100`).

---

## **Step 6: Update your `.env` (if needed)**

```env
NEXT_PUBLIC_FRONTEND_URL=http://192.168.1.100:8080
NEXT_PUBLIC_API_URL=http://192.168.1.100:8080/api
```

- This ensures LAN clients can reliably access your Next.js server.

---

✅ **Tips:**

- This works best with **routers**, not mobile hotspots.
- If you plan a permanent LAN server, **DHCP reservation is the most professional and stable approach**.
- PM2 + `0.0.0.0` + reserved IP = server is stable and always accessible on the network.
