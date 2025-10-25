## **Step 1: Download & Install Rclone**

1. Go to the official website: [https://rclone.org/downloads/](https://rclone.org/downloads/)
2. Download the **Windows 64-bit zip**.
3. Extract it to a folder, e.g.,

   ```
   C:\Program Files\rclone
   ```

4. Add `rclone.exe` to your **system PATH** so you can run it from anywhere:

   - Right-click **This PC → Properties → Advanced system settings → Environment Variables**
   - Under **System variables**, find **Path → Edit → New** → add `C:\Program Files\rclone`
   - Open a new CMD and type:

     ```
     rclone version
     ```

     You should see the version printed.

---

## **Step 2: Configure Rclone with Google Drive**

1. Open **CMD** and run:

   ```
   rclone config
   ```

2. You’ll see a menu. Choose:

   ```
   n) New remote
   name> gdrive
   ```

   _(you can pick any name; I use `gdrive` for clarity)_

3. Select **storage type**:

   ```
   13 / Google Drive
   ```

4. Follow prompts:

   - Client ID / Secret → leave empty unless you want your own Google API credentials.
   - Scope → choose **full access** (`drive`)
   - Root folder ID → leave empty
   - Service Account → no
   - Edit advanced config → no
   - Use auto config → yes

5. A browser will open. Log into the Google account you want to backup to and allow access.

6. After success, you’ll see:

   ```
   [gdrive] OK remote
   ```

7. Exit config (`q`).

---

## **Step 3: Test Rclone Google Drive Connection**

- In CMD, try:

  ```
  rclone lsd gdrive:
  ```

- You should see the root folders of your Google Drive.

This confirms `rclone` can talk to Google Drive.

---

## **Step 4: Write the MongoDB Backup Script**

**Notes:**

- `mongodump` is executed inside the Docker container.
- The backup file is copied to your host machine.
- Then uploaded to Google Drive using `rclone`.
- Local backups older than 7 days are deleted to save space.

---

## **Step 5: Test the Backup Script**

1. Open CMD inside `yadahportal` folder:

   ```
   yadah_backup_gdrive.bat
   ```

2. Confirm:

   - `.gz` file created in `C:\ServerApps\yadahdb_backups`
   - Uploaded to `gdrive:/yadahdb_backups/`

---

## **Step 6: Schedule Automatic Daily Backup (Task Scheduler)**

1. Open **Task Scheduler → Create Task**
2. **General tab**:

   - Name: `Yadah MongoDB Backup`
   - Run whether user is logged on or not
   - Run with highest privileges

3. **Triggers tab** → **New** → Daily at e.g., 2:00 AM
4. **Actions tab** → **New** → Start a program:

   ```
   Program/script: C:\WINDOWS\system32\cmd.exe
   Add arguments: /c "C:\ServerApps\yadahportal\yadah_backup_gdrive.bat"
   Start in: C:\ServerApps\yadahportal
   ```

5. **Conditions & Settings** → adjust if needed (like only run if network available)
6. Save, test by right-click → Run
