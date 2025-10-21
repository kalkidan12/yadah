# MongoDB Windows Setup for Yadah Portal

## 1. Directory Structure

I recommend placing MongoDB and your data/logs in **dedicated directories**:

```
C:\
 ├─ ServerApps\
 │   ├─ MongoDB\
 │   │   ├─ data\
 │   │   ├─ log\
 │   │   └─ mongod.cfg
 └─ yadahportal\       (Your Next.js project)
```

- `data` → MongoDB database files.
- `log` → MongoDB logs.
- `mongod.cfg` → MongoDB configuration file.

---

## 2. MongoDB Configuration (`mongod.cfg`)

Create `C:\ServerApps\MongoDB\mongod.cfg` with the following content:

```yaml
# MongoDB Configuration for Yadah Portal

# Where to store data.
storage:
  dbPath: C:\ServerApps\MongoDB\data
  journal:
    enabled: true

# Where to log.
systemLog:
  destination: file
  path: C:\ServerApps\MongoDB\log\mongo.log
  logAppend: true

# Network configuration
net:
  port: 27017
  bindIp: 127.0.0.1 # local only for security

# Security (optional for production)
security:
  authorization: disabled # enable later if you add users
```

✅ Notes:

- `bindIp` ensures MongoDB only accepts local connections (good for a single-server setup).
- `logAppend: true` avoids overwriting logs.

---

## 3. Install MongoDB as a Windows Service

1. Open **Command Prompt as Administrator**.
2. Stop/remove any old MongoDB service (if exists):

```cmd
sc stop MongoDB
sc delete MongoDB
```

3. Navigate to MongoDB binary folder:

```cmd
cd "C:\Program Files\MongoDB\Server\8.0\bin"
```

4. Install MongoDB as a service:

```cmd
mongod --config "C:\ServerApps\MongoDB\mongod.cfg" --install
```

5. Start the MongoDB service:

```cmd
net start MongoDB
```

- MongoDB will now **start automatically with Windows**.
- You can verify service status:

```cmd
sc query MongoDB
```

---

## 4. Testing the Service

You can test MongoDB from **cmd or Compass**:

```cmd
mongo --host 127.0.0.1 --port 27017
```

It should connect without errors.

---

## 5. Notes for Yadah Portal `.env`

Make sure your `.env` file points to this MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/yadah
```

- `localhost` ensures it uses the local service.
- Port `27017` matches your config.

---

## 6. Advantages of This Setup

- MongoDB runs as a **Windows service** → automatic on boot.
- Data and logs are **separated in `C:\ServerApps\MongoDB`** → easy backups.
- No need for `mongod` command every time → just start your Next.js app.
