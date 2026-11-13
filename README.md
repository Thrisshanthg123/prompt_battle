# SANCHAARI – AI-Powered Community Mobility Coordinator

> **"When the bus stops, the journey doesn't."**

SANCHAARI is an intelligent community transit coordination platform designed to bridge the first-mile, last-mile, and emergency transit gaps faced by students and rural commuters when public buses break down or become delayed.

---

## 👥 Hackathon Team Roles & Architectural Separation

| Member | Domain & Responsibilities | Key Components & Files | Status |
| :--- | :--- | :--- | :--- |
| **Member 1 (Current)** | **Student Mobility Portal**<br>• Student Dashboard<br>• Journey Request Form<br>• My Journeys List<br>• Live Journey Details & GPS Tracking<br>• Onward Bus Information<br>• Student Profile & Emergency Contacts | `src/pages/student/*`<br>`src/components/tracking/*`<br>`src/layouts/*` | **Implemented & Verified** |
| **Member 2** | **Community Vehicle Portal & AI Matching Engine**<br>• Driver / Vehicle Onboarding<br>• Ride Acceptance & Fleet Management<br>• Heuristic / AI Matching Algorithm | `src/pages/community/CommunityVehiclePortal.jsx`<br>`src/services/matchingEngineInterface.js` | **Documented Interface Ready** |
| **Member 3** | **Admin Dashboard & Disruption Management**<br>• Bus Breakdown Logging<br>• Disruption Broadcast Engine<br>• Route Analytics & Dispatching | `src/pages/admin/AdminDashboard.jsx`<br>`src/services/disruptionEngineInterface.js` | **Documented Interface Ready** |

---

## 🛠️ Technology Stack

- **Framework:** React 18 with Vite
- **Language:** JavaScript (JSX)
- **Styling:** Tailwind CSS (Custom transit palette & responsive design)
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **State Management:** React Context API (`MobilityContext.jsx`)
- **Persistence:** Browser `localStorage` with initial realistic demo seed data

---

## 📂 Project Directory Structure

```text
prompt_battle/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   ├── MobilityContext.jsx       # Shared application state & storage sync
│   │   └── mockData.js              # Realistic seed data for demo
│   ├── layouts/
│   │   ├── RootLayout.jsx           # Global layout with alert banner
│   │   ├── Navbar.jsx               # Header with branding & profile
│   │   ├── Sidebar.jsx              # Role-aware navigation sidebar
│   │   └── Footer.jsx               # Project footer
│   ├── pages/
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx     # Overview, active trip spotlight, alerts
│   │   │   ├── JourneyRequestForm.jsx   # Request ride with preset locations & urgency
│   │   │   ├── MyJourneys.jsx           # List with filter by status & search
│   │   │   ├── JourneyDetails.jsx       # Stepper, map radar, driver info & SOS
│   │   │   ├── OnwardBusInfo.jsx        # Public bus schedules & breakdown advisory
│   │   │   └── StudentProfile.jsx       # Student ID, emergency contacts & pass
│   │   ├── community/
│   │   │   └── CommunityVehiclePortal.jsx # Member 2 workspace & interface
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx         # Member 3 workspace & interface
│   │   └── NotFound.jsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── AlertBanner.jsx
│   │   └── tracking/
│   │       ├── RouteMapMock.jsx          # Live schematic GPS transit radar
│   │       └── LiveTrackerSimulator.jsx  # Interactive trip lifecycle controller
│   ├── services/
│   │   ├── matchingEngineInterface.js    # Member 2 AI matching engine contract
│   │   └── disruptionEngineInterface.js  # Member 3 disruption engine contract
│   └── utils/
│       └── formatters.js                 # Date, currency, and badge helpers
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

### 3. Production Build
```bash
npm run build
```

---

## 🔄 Shared Data Contracts & Integration Guide

### For Member 2 (AI Matching Engine):
- Open `src/services/matchingEngineInterface.js`.
- Replace the mock calculation inside `findBestVehicleMatch(request, availableVehicles)` with your AI/heuristic matching model.
- The student request form automatically calls this function upon submission.

### For Member 3 (Disruption Management):
- Open `src/services/disruptionEngineInterface.js`.
- Connect your broadcast algorithm in `broadcastDisruption(disruptionData)`.
- Disruptions logged automatically populate the alert banner on the student portal and update the `OnwardBusInfo` schedule feed.
