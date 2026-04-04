# API Documentation

Base URL: `http://localhost:8080`

---

## POST /api/alerts

Create a new SOS alert.

**Request Body (JSON):**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "trigger": "BUTTON",
  "userId": "demo-user",
  "emergencyContacts": "+1234567890"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| latitude | Double | ✅ | GPS latitude |
| longitude | Double | ✅ | GPS longitude |
| trigger | String | ✅ | BUTTON / VOICE_DETECTED / AI_SCREAM_DETECTED |
| userId | String | ❌ | Defaults to "demo-user" |
| emergencyContacts | String | ❌ | Comma-separated phone numbers, defaults to "+1234567890" |

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "SENT",
  "message": "Alert sent + GPS attached",
  "timestamp": "2024-01-15T14:30:00"
}
```

---

## GET /api/alerts

Get all alerts, paginated, latest first.

**Query Parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| page | 0 | Page number (0-based) |
| size | 20 | Results per page |

**Response (200 OK):**
```json
{
  "alerts": [
    {
      "id": "550e8400-...",
      "userId": "demo-user",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "trigger": "BUTTON",
      "timestamp": "2024-01-15T14:30:00",
      "status": "SENT",
      "emergencyContacts": "+1234567890"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0
}
```

---

## GET /api/alerts/recent

Get the last 10 alerts (for mobile dashboard).

**Response (200 OK):**
```json
[
  {
    "id": "...",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "trigger": "VOICE_DETECTED",
    "timestamp": "2024-01-15T14:35:00",
    "status": "SENT"
  }
]
```

---

## DELETE /api/alerts/{id}

Delete a specific alert by ID.

**Response (200 OK):**
```json
{
  "message": "Alert deleted",
  "id": "550e8400-..."
}
```

---

## DELETE /api/alerts

Delete all alerts (demo reset).

**Response (200 OK):**
```json
{
  "message": "All alerts cleared"
}
```

---

## GET /dashboard

Returns the live HTML dashboard page (served by Thymeleaf).

---

## Data Models

### Alert
| Field | Type | Values |
|-------|------|--------|
| id | UUID string | auto-generated |
| userId | String | any string, default "demo-user" |
| latitude | Double | GPS latitude |
| longitude | Double | GPS longitude |
| trigger | Enum | BUTTON, VOICE_DETECTED, AI_SCREAM_DETECTED |
| timestamp | LocalDateTime | UTC ISO-8601 |
| status | Enum | SENT, ACKNOWLEDGED, RESPONDED |
| emergencyContacts | String | comma-separated phone numbers |

### TriggerType
| Value | Description |
|-------|-------------|
| BUTTON | Physical SOS button press |
| VOICE_DETECTED | Voice distress keyword detected |
| AI_SCREAM_DETECTED | AI audio classifier detected scream/distress |

### AlertStatus
| Value | Description |
|-------|-------------|
| SENT | Alert sent, awaiting response |
| ACKNOWLEDGED | Contact acknowledged receipt |
| RESPONDED | Emergency response dispatched |
