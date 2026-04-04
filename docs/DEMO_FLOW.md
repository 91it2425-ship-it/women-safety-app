# Demo Flow – Hackathon Presentation Script

## Setup Before Demo (5 minutes before)

1. Start backend: `cd backend && mvn spring-boot:run`
2. Open http://localhost:8080/dashboard in browser (full screen)
3. Start Android app on emulator or phone
4. Enable Test Mode if GPS is unreliable

---

## Live Demo Script (~5 minutes)

### Scene 1: Show the App

**Say:** "This is our Women's Safety Smart App. The interface is designed to be operable with one hand, even in a panic situation."

**Show:**
- The big red SOS button (prominent, center screen)
- GPS status: "✅ GPS Locked" with real coordinates
- Test Mode toggle
- Voice and AI simulator buttons

---

### Scene 2: Press SOS

**Say:** "The most important feature – press SOS and watch what happens."

**Action:** Press the red **SOS** button

**Show:**
- Toast notification: "✅ Alert sent + GPS attached"
- Phone vibrates (haptic feedback)
- Backend console log appears

---

### Scene 3: Switch to Dashboard

**Say:** "Our law enforcement dashboard receives the alert instantly."

**Switch to browser showing http://localhost:8080/dashboard**

**Show:**
- New alert appears in the table with **green flash animation**
- Trigger: "🆘 SOS Button"
- Exact GPS coordinates
- Timestamp
- Stats update: "Total Alerts: 1"

---

### Scene 4: Open Google Maps

**Say:** "Responders can immediately see the exact location."

**Action:** Click the alert row in the dashboard

**Show:** Google Maps opens with the exact pin location

---

### Scene 5: Backend Logs (SMS)

**Say:** "For demo purposes, we're using placeholder credentials – but in production, this sends a real SMS via Twilio."

**Show backend terminal:**
```
📱 [TEST MODE] SMS would be sent to: +1234567890
   Message: 🚨 SOS Alert! Women's Safety App. Location: https://maps.google.com/... Time: ...
```

**Say:** "Add real Twilio credentials and it sends live SMS to emergency contacts within seconds."

---

### Scene 6: Voice/AI Simulators

**Say:** "Phase 2 adds proactive detection – no button press required."

**Action:** Press **Voice Detection Simulator**

**Show:**
- Dashboard updates with new alert tagged "🎤 Voice"
- Different color badge

**Action:** Press **AI Detection Simulator**

**Show:**
- Dashboard updates with "🤖 AI Detected" alert

**Say:** "In Phase 2, TensorFlow audio classification automatically detects screams and distress calls – triggering alerts even when the victim can't press a button."

---

### Scene 7: Live API Response

**Say:** "This is a proper REST API – ready for law enforcement systems to integrate."

**Show:** Open http://localhost:8080/api/alerts in browser

**Show:** JSON array of all alerts with full details

---

## Q&A Talking Points

**Q: What happens if the phone has no internet?**
A: Phase 2 includes local caching + SMS fallback via direct SMS (no internet needed).

**Q: How does it scale to a whole city?**
A: The backend is stateless – add a load balancer and switch H2 to PostgreSQL. Cloud-ready.

**Q: Is voice detection working today?**
A: The simulator shows the integration point. TensorFlow audio model is Phase 2 (2-week sprint).

**Q: What about privacy?**
A: All data encrypted in transit (HTTPS in production). Location only shared on SOS trigger, not passively.

**Q: How do emergency contacts get set?**
A: Settings screen (Phase 2) – family members and local emergency number.
