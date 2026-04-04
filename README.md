# Women's Safety Smart App – Hackathon Prototype

> "Real-time protection with AI + law enforcement integration"

A complete hackathon-ready prototype consisting of:
- **Android App (Java)** – SOS button, GPS, Voice/AI simulators
- **Spring Boot Backend (Java)** – REST API + Twilio SMS + H2 database
- **Live Dashboard (HTML/JS)** – Real-time alert feed with maps integration

---

## 🚀 Quick Start

### 1. Run the Backend

**Requirements:** Java 17+, Maven 3.8+

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

- Dashboard: http://localhost:8080/dashboard
- API:       http://localhost:8080/api/alerts
- H2 Console: http://localhost:8080/h2-console

---

### 2. Run the Android App

**Requirements:** Android Studio Hedgehog (2023.1.1) or later, Android SDK 34

1. Open `android-app/` folder in Android Studio
2. Wait for Gradle sync to complete
3. Update `BASE_URL` in `AlertService.java`:
   - Emulator: `http://10.0.2.2:8080`
   - Physical device: `http://<your-laptop-ip>:8080`
4. Run on emulator or device (Android 7.0+ / API 24+)

---

## 📱 App Features

| Feature | Description |
|---------|-------------|
| 🆘 SOS Button | Large red button – sends alert with GPS coordinates |
| 🎤 Voice Simulator | Simulates voice distress detection trigger |
| 🤖 AI Simulator | Simulates AI scream detection trigger |
| 📡 GPS Status | Real-time GPS lock indicator |
| 📍 Location Display | Shows current latitude/longitude |
| 🧪 Test Mode | Uses mock San Francisco coordinates |
| ⏱️ Last Alert | Timestamp of most recent alert |

---

## 🖥️ Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/alerts` | Create new SOS alert |
| GET | `/api/alerts` | Get all alerts (paginated) |
| GET | `/api/alerts/recent` | Get last 10 alerts |
| DELETE | `/api/alerts/{id}` | Delete specific alert |
| DELETE | `/api/alerts` | Clear all alerts |
| GET | `/dashboard` | Live HTML dashboard |

See [docs/API_DOCS.md](docs/API_DOCS.md) for full documentation.

---

## 📊 Dashboard

Open **http://localhost:8080/dashboard** in any browser.

- Live alert feed (auto-refreshes every 2 seconds)
- Green flash animation on new alerts
- Click any row → opens Google Maps
- Stats: Total alerts, by trigger type
- "Clear All" button for demo resets

---

## 💬 Twilio SMS Setup

To enable real SMS alerts:

1. Create a free Twilio account at https://www.twilio.com
2. Get your Account SID, Auth Token, and a Twilio phone number
3. Update `backend/src/main/resources/application.properties`:

```properties
twilio.account.sid=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
twilio.auth.token=your_real_auth_token
twilio.phone.from=+1XXXXXXXXXX
```

4. Restart the backend

Without real credentials, the backend logs: `📱 [TEST MODE] SMS would be sent to: +1234567890`

---

## 🏗️ Project Structure

```
women-safety-app/
├── README.md
├── .gitignore
├── android-app/                    # Android application (Java)
│   ├── app/src/main/java/com/womensafety/
│   │   ├── MainActivity.java       # Main UI + logic
│   │   ├── AlertService.java       # API calls to backend
│   │   ├── LocationManager.java    # GPS (FusedLocationProvider)
│   │   └── models/Alert.java       # Alert data model
│   ├── app/src/main/res/
│   │   ├── layout/activity_main.xml
│   │   ├── values/strings.xml
│   │   └── values/colors.xml
│   ├── app/build.gradle
│   └── settings.gradle
├── backend/                        # Spring Boot backend (Java)
│   ├── src/main/java/com/womensafety/
│   │   ├── WomenSafetyApp.java     # Main class
│   │   ├── controller/
│   │   │   ├── AlertController.java
│   │   │   └── DashboardController.java
│   │   ├── service/
│   │   │   ├── AlertService.java
│   │   │   └── TwilioService.java
│   │   ├── model/Alert.java        # JPA entity
│   │   ├── repository/AlertRepository.java
│   │   ├── config/
│   │   │   ├── TwilioConfig.java
│   │   │   └── CorsConfig.java
│   │   └── dto/AlertRequest.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── templates/dashboard.html
│   └── pom.xml
└── docs/
    ├── SETUP.md
    ├── API_DOCS.md
    ├── DEMO_FLOW.md
    └── ARCHITECTURE.md
```

---

## 🎯 Demo Flow (Hackathon)

1. Show app with SOS button + "GPS Locked" indicator
2. Press **SOS** → toast shows "Alert sent + GPS attached"
3. Switch to dashboard at http://localhost:8080/dashboard
4. New alert appears with green flash animation
5. Click alert row → Google Maps opens with exact location
6. Backend logs: `SMS would be sent to: +1234567890`
7. Press **Voice Simulator** → alert logged as VOICE_DETECTED
8. Open http://localhost:8080/api/alerts → show live JSON

See [docs/DEMO_FLOW.md](docs/DEMO_FLOW.md) for complete presentation script.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Android (Java), FusedLocationProvider |
| Backend | Spring Boot 3.2, Spring Data JPA |
| Database | H2 (in-memory, demo) → PostgreSQL (production) |
| SMS | Twilio SDK |
| Dashboard | Vanilla HTML/CSS/JS |
| Build | Maven (backend), Gradle (Android) |

---

## 📈 Scalability

- **Database:** Switch `application.properties` to PostgreSQL URL
- **Auth:** JWT-ready (Phase 2)
- **AI:** TensorFlow audio classification stub (Phase 2)
- **API:** Stateless REST – scales horizontally
