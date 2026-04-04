# Step-by-Step Setup Guide

## Prerequisites

### Backend
- Java 17 or newer: https://adoptium.net/
- Maven 3.8+: https://maven.apache.org/download.cgi
- (Optional) IntelliJ IDEA or VS Code

### Android App
- Android Studio Hedgehog (2023.1.1+): https://developer.android.com/studio
- Android SDK 34 (auto-downloaded by Android Studio)
- JDK 17 (bundled with Android Studio)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/91it2425-ship-it/women-safety-app.git
cd women-safety-app
```

---

## Step 2: Start the Backend

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

You should see:
```
Started WomenSafetyApp in X.XXX seconds (process running as PID XXXXX)
```

**Verify it works:**
```bash
# macOS/Linux
curl -X POST http://localhost:8080/api/alerts \
  -H "Content-Type: application/json" \
  -d '{"latitude":37.7749,"longitude":-122.4194,"trigger":"BUTTON"}'

# Windows PowerShell
Invoke-WebRequest -Method Post -Uri http://localhost:8080/api/alerts `
  -ContentType "application/json" `
  -Body '{"latitude":37.7749,"longitude":-122.4194,"trigger":"BUTTON"}'
```

Expected response:
```json
{"id":"...","status":"SENT","message":"Alert sent + GPS attached","timestamp":"..."}
```

**Open Dashboard:**
http://localhost:8080/dashboard

---

## Step 3: Set Up Android App

1. Open Android Studio
2. **File → Open** → select the `android-app/` folder
3. Wait for Gradle sync (~2-3 min first time)
4. Open `app/src/main/java/com/womensafety/AlertService.java`
5. Update `BASE_URL`:
   - **Emulator:** `http://10.0.2.2:8080` (already set by default)
   - **Physical device:** `http://192.168.X.X:8080` (your laptop's LAN IP)
6. Click **Run** (green triangle) → choose emulator/device

---

## Step 4: Test the Full Flow

1. App shows "⏳ Acquiring..." → GPS locks → "✅ GPS Locked"
2. Press **SOS** button → toast appears: "✅ Alert sent + GPS attached"
3. Switch to browser at http://localhost:8080/dashboard
4. New alert appears with green flash
5. Click the row → Google Maps opens

---

## Step 5: Enable Test Mode (No GPS needed)

Toggle **"🧪 Test Mode"** in the app to use mock coordinates (San Francisco, CA).
Useful when running on an emulator without GPS simulation.

---

## Twilio SMS (Optional)

1. Sign up at https://www.twilio.com (free trial available)
2. Get: Account SID, Auth Token, Twilio phone number
3. Edit `backend/src/main/resources/application.properties`:
```properties
twilio.account.sid=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
twilio.auth.token=your_real_auth_token
twilio.phone.from=+1XXXXXXXXXX
```
4. Restart backend

Without credentials, backend logs: `📱 [TEST MODE] SMS would be sent to: +1234567890`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8080 in use | `kill $(lsof -ti:8080)` or change `server.port` in properties |
| Android can't reach backend | Check `BASE_URL` in AlertService.java; ensure same WiFi |
| GPS not locking (emulator) | Enable Test Mode, or use Android Studio emulator GPS |
| Maven not found | `brew install maven` (mac) or download from https://maven.apache.org |
