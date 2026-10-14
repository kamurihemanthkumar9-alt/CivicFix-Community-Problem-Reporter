# CivicFix — Community Problem Reporter

A modern, responsive, civic-tech web application empowering citizens to report local infrastructure problems (potholes, overflowing garbage, broken streetlights, water leakage, damaged railings), track repairs in real-time, and enabling municipal authorities to prioritize, dispatch work orders, and communicate status updates.

Built for municipal hackathons, civic innovation challenges, and community smart-city initiatives.

---

## Key Features

### 1. Citizen Problem Reporting
- **Dynamic Categories**: Roads & Potholes, Garbage & Sanitation, Streetlights & Electrical, Water & Drainage, Public Infrastructure, and Other.
- **Smart Photo Proof**: Drag-and-drop or file upload with instant preview, plus 1-click sample civic photos for rapid hackathon testing.
- **Geographic Pinning**: Interactive Leaflet map with click-to-pin, exact latitude/longitude coordinate tracking, and an optional **"Use My Location"** browser geolocation button (with zero permission enforcement).
- **Automated Human-Readable ID**: Generates unique tracking IDs (e.g. `CF-2026-1042`).

### 2. Community Issue Map (Leaflet + OpenStreetMap)
- Real-time interactive map with **status-coded custom markers**:
  - 🟠 **Amber**: Reported / Pending Review
  - 🔵 **Blue**: In Progress / Dispatched Crews
  - 🟢 **Emerald**: Resolved & Verified
- Detailed map popups with photo thumbnails, priority ratings, addresses, and 1-click navigation to the full complaint dossier.
- Multi-criteria map filters for category, status, urgency, and live keyword search.

### 3. Smart Priority Scoring Engine
- Transparent, explainable algorithmic prioritization model (1 to 10 scale):
  - **Base Urgency**: Low (+1), Medium (+2), High (+3)
  - **Public Safety Context**: High-risk keywords (e.g. "hazard", "open manhole", "flooding", "school", "hospital") add +2 to +3 points.
  - **Community Confirmation**: Independent citizen confirmations / upvotes boost urgency (+1 point per confirmation).
  - **Aging Unresolved Queue**: Issues pending for > 48 hours receive additional priority.
- Interactive tooltip breakdowns explaining *why* each issue received its score.

### 4. Proactive Duplicate Detection
- Before a citizen submits a report, CivicFix calculates geographic distance (Haversine formula < 350m) and text similarity across open reports in the same category.
- Displays a clean warning modal with a preview of the existing report.
- Citizens can choose between:
  - **"Confirm & Boost Priority"**: Adds their confirmation (+1 upvote) to escalate municipal attention without creating duplicate work orders.
  - **"It's a Different Issue"**: Submits a separate report if the issue is distinct.

### 5. Complaint Tracking & Audit Timeline
- Search any issue by Complaint ID (e.g. `CF-2026-1042`) from the persistent top navigation or dedicated Tracker tab.
- Visual 3-stage progress stepper: **Reported ➔ In Progress ➔ Resolved**.
- Timestamped audit history log showing actor signatures (e.g. "Sanitation Supervisor", "Public Works Dispatch") and official resolution comments.
- Fullscreen photo lightbox for detailed inspection.

### 6. Municipal Admin Management Portal
- Role-based console with municipal triage metrics (Resolution rate, Average priority, Backlog breakdown).
- Comprehensive searchable and sortable complaint data table.
- **1-Click Quick Status Transitions**: Instantly move complaints between Reported, In Progress, and Resolved.
- **Resolution Sign-off Modal**: Add official comments and update urgency.
- **CSV Data Export**: Export active complaints with coordinates and notes for field crews.
- **Demo Data Reset**: Instant 1-click restoration of sample demo reports.

### 7. Dual-Mode Backend (Local Demo Mode + Supabase Cloud)
- **Zero-Config Local Demo Mode**: Works immediately out-of-the-box using browser `localStorage` and preloaded realistic civic sample data.
- **Instant Supabase Cloud Integration**: Provide your Supabase URL and Anon Key in `.env` or through the interactive in-app Backend Settings modal to switch to live cloud Postgres and Storage. Complete SQL schema and Row-Level-Security (RLS) policies provided in `supabase/schema.sql`.

---

## Technology Stack

- **Frontend**: React 19, Vite 8
- **Language**: JavaScript (ESM)
- **Styling**: Tailwind CSS 3.4
- **Maps**: Leaflet 1.9, React-Leaflet 5, OpenStreetMap
- **Data Visualizations**: Recharts 3
- **Icons**: Lucide React
- **Backend / Database**: Supabase (`@supabase/supabase-js`) + LocalStorage Fallback

---

## Project Structure

```
civicfix/
├── index.html                   # Entry HTML with Inter fonts & Leaflet styling
├── package.json                 # Dependencies & build scripts
├── vite.config.js               # Vite bundler configuration
├── tailwind.config.js           # Tailwind theme & civic color palette
├── postcss.config.js            # PostCSS plugins
├── .env.example                 # Sample Supabase environment variables
├── README.md                    # Project documentation
├── HACKATHON_GUIDE.md           # 5-minute hackathon judge demo script
├── test/
│   └── verify.js                # Automated verification script for core algorithms
├── supabase/
│   └── schema.sql               # PostgreSQL schema, RLS policies, and triggers
└── src/
    ├── main.jsx                 # Application entry point
    ├── App.jsx                  # Main coordinator: navigation, state, and modals
    ├── index.css                # Tailwind directives and Leaflet map CSS overrides
    ├── config/
    │   └── supabase.js          # Supabase client setup with dynamic runtime override
    ├── data/
    │   └── sampleReports.js     # Realistic sample civic complaints & preset photos
    ├── services/
    │   ├── db.js                # Unified database layer (Supabase + localStorage)
    │   ├── priorityScorer.js    # Smart priority calculation algorithm
    │   └── duplicateDetector.js # Haversine distance & text similarity duplicate detector
    └── components/
        ├── common/              # Reusable badges, modals, and toast provider
        ├── layout/              # Navbar, Sidebar, and MobileNav
        ├── dashboard/           # Metric cards, Recharts analytics, and complaint feed
        ├── report/              # Multi-step report form, map picker, and duplicate modal
        ├── map/                 # Full interactive Leaflet community map
        ├── details/             # Dedicated complaint view, progress timeline, and tracker
        └── admin/               # Municipal operations table and status update dialog
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; tested on v24)
- npm (v9 or higher; tested on v11)

### Installation

1. Navigate to the project directory:
   ```bash
   cd civicfix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open the displayed URL (usually `http://localhost:5173`) in your browser.

4. (Optional) Run the automated verification test suite:
   ```bash
   node test/verify.js
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## Connecting Supabase (Optional)

1. Create a free project at [Supabase.com](https://supabase.com).
2. Open the SQL Editor in your Supabase dashboard and execute the script in `supabase/schema.sql`.
3. In your Supabase project settings, copy the **Project URL** and **Anon Public Key**.
4. Either:
   - Create a `.env` file in the `civicfix` directory:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```
   - **Or** click the **"Demo Mode"** badge in the top navigation bar of the running web app and paste your credentials directly into the UI!
