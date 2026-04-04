# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ANDROID APP (Java)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ MainActivity │  │AlertService  │  │  LocationManager   │ │
│  │  (UI + UX)   │→ │ (HTTP calls) │  │ (FusedLocation)    │ │
│  └──────────────┘  └──────┬───────┘  └────────────────────┘ │
└─────────────────────────────│───────────────────────────────┘
                              │ HTTP POST /api/alerts
                              │ (JSON: lat, lon, trigger)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  SPRING BOOT BACKEND (Java)                  │
│                                                              │
│  ┌─────────────────────────────────────────┐                │
│  │           AlertController                │                │
│  │  POST /api/alerts                        │                │
│  │  GET  /api/alerts                        │                │
│  │  GET  /api/alerts/recent                 │                │
│  │  DELETE /api/alerts                      │                │
│  └──────────────┬──────────────────────────┘                │
│                 │                                            │
│  ┌──────────────▼──────────────────────────┐                │
│  │           AlertService                   │                │
│  │  - validate + create alert               │                │
│  │  - save to repository                    │                │
│  │  - trigger TwilioService                 │                │
│  └──────────┬────────────────┬─────────────┘                │
│             │                │                               │
│  ┌──────────▼───┐   ┌───────▼──────────────┐                │
│  │AlertRepository│   │  TwilioService        │                │
│  │  (JPA/H2)    │   │  - Send SMS via API   │                │
│  └──────────────┘   │  - Log if placeholder │                │
│                     └──────────────────────┘                │
│                                                              │
│  ┌──────────────────────────────────────────┐               │
│  │        DashboardController                │               │
│  │  GET /dashboard → dashboard.html          │               │
│  └──────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                              │
                     GET /api/alerts
                     (every 2 seconds)
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    DASHBOARD (HTML/JS)                        │
│                  http://localhost:8080/dashboard              │
│                                                              │
│  - Live alert table (auto-refreshes)                         │
│  - Green animation on new alerts                             │
│  - Click row → Google Maps                                   │
│  - Stats: total / by trigger type                            │
│  - Clear all button                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Details

### Android App
- **MainActivity**: UI controller, handles button clicks, displays GPS
- **LocationManager**: Wraps `FusedLocationProviderClient` for real GPS
- **AlertService**: HTTP client using `HttpURLConnection` (no extra libs needed)
- **models/Alert**: POJO matching backend JSON structure

### Spring Boot Backend
- **AlertController**: RESTful endpoints with proper HTTP status codes
- **AlertService**: Business logic, coordinates repository + Twilio
- **TwilioService**: SMS sending or test-mode logging
- **Alert (JPA Entity)**: UUID primary key, enum fields for trigger/status
- **AlertRepository**: Spring Data JPA auto-generates queries
- **CorsConfig**: Allows all origins on `/api/**` for mobile + dashboard
- **TwilioConfig**: Reads credentials from `application.properties`

### Database
- **H2 In-Memory**: Zero-setup, perfect for demo
- **Production path**: Change JDBC URL to PostgreSQL, add `pg` driver dependency

---

## Data Flow: SOS Alert

```
1. User presses SOS button
      ↓
2. Android vibrates + gets GPS coords from FusedLocationProvider
      ↓
3. AlertService.sendAlert() → HTTP POST to /api/alerts
   Body: {latitude, longitude, trigger: "BUTTON", userId, emergencyContacts}
      ↓
4. AlertController.createAlert() validates input
      ↓
5. AlertService.createAlert() sets defaults + saves to H2 via JPA
      ↓
6. TwilioService.sendSosAlert() called:
   - If placeholder credentials → logs: "📱 [TEST MODE] SMS would be sent to..."
   - If real credentials → Twilio API sends SMS to emergency contacts
      ↓
7. Response: {id, status: "SENT", message: "Alert sent + GPS attached"}
      ↓
8. Android shows Toast: "✅ Alert sent + GPS attached"
      ↓
9. Dashboard (polling every 2s) → GET /api/alerts → table updates with green flash
```

---

## Phase Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| 1 (Now) | SOS + GPS + REST API + Dashboard + Twilio stub | ✅ Built |
| 2 | Voice keyword detection, TensorFlow audio ML | Planned |
| 3 | Law enforcement dashboard, JWT auth, real-time WebSocket | Planned |
| Prod | PostgreSQL, HTTPS, load balancer, monitoring | Infrastructure |
