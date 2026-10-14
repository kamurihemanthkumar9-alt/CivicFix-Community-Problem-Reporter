# CivicFix — Hackathon Demonstration Guide (5-Minute Walkthrough)

This guide provides a structured script to demonstrate the **CivicFix** platform to judges or evaluators during a hackathon or demo session.

---

## 1. Quick Pitch (30 Seconds)
> "Municipal public works departments often struggle with noisy complaint channels, duplicate reports, and delayed citizen feedback. **CivicFix** is a modern civic-tech platform that pairs intelligent crowd-sourced reporting with automated priority triage, proactive duplicate detection, and live GIS tracking — transforming how cities respond to infrastructure hazards."

---

## 2. Demonstration Flow

### Step 1: Citizen Dashboard & Live Analytics (45 Seconds)
1. **Show the Summary Cards**: Point out the live metrics: Total Reports, Pending Review, In Progress, and Resolved. Click any card (e.g. "Pending Review") to show how the complaint feed instantly filters.
2. **Show Analytics Charts**:
   - The **Category Breakdown** donut chart (Recharts) shows distribution across Potholes, Garbage, Streetlights, and Water Drainage.
   - The **Urgency & Status Distribution** stacked bar chart illustrates how the city allocates maintenance crews based on severity.
3. **Show Live Search & Filter Bar**: Type `"Market"` or `"pothole"` in the search bar to demonstrate instant reactive filtering.

---

### Step 2: Reporting a Problem with Photo & Map Pinning (1 Minute)
1. Click the prominent blue **"Report Issue"** button in the header.
2. Fill out a sample complaint:
   - **Category**: Select *Potholes & Roads*.
   - **Title**: Type `"Deep pothole near City Library entrance"`.
   - **Description**: Type `"Large crater in right turn lane causing cars to swerve onto the sidewalk"`.
   - **Urgency**: Select *High Urgency*. Note how the **Estimated Priority Score** dynamically updates at the bottom of the form!
   - **Photo**: Click one of the quick demo preset photo chips (e.g. *"Deep Road Pothole"*) to show instant preview.
   - **Location**: Click the interactive mini-map to drop a pin, or click the **"Use My Location"** button.
3. Click **"Submit Report"**. Show the instant toast notification and the newly generated Complaint ID (e.g. `CF-2026-XXXX`).

---

### Step 3: Demonstrating Proactive Duplicate Detection (1 Minute)
1. Click **"Report Issue"** again.
2. Attempt to file a report with similar coordinates or text near an existing issue:
   - Category: *Potholes & Roads*
   - Title: `"Hazardous deep pothole on Market Street"`
   - Address: `"Market Street"`
   - Set location pin near `(37.7833, -122.4089)`.
3. Click **"Submit Report"**.
4. **Show the Duplicate Detection Modal**:
   - The modal alerts the user: *"A similar complaint already exists nearby!"* (Haversine distance ~14m).
   - Point out the two options:
     - Click **"Confirm & Boost Priority (+1)"**: Shows how the system aggregates community signals without spamming city workers with duplicate work orders.
     - Or click **"It's a Different Issue"** if it is a genuinely separate issue.

---

### Step 4: Community Issue Map (45 Seconds)
1. Click **"Community Map"** on the sidebar or header.
2. Show the full Leaflet OpenStreetMap view:
   - Notice the status-coded custom pins:
     - 🟠 **Amber**: Reported
     - 🔵 **Blue**: In Progress
     - 🟢 **Emerald**: Resolved
3. Click on a pin to open the rich popup showing the photo, urgency score, and address.
4. Click **"View Full Details"** from the popup to navigate directly to the complaint dossier.

---

### Step 5: Complaint Tracking & Status Timeline (30 Seconds)
1. Highlight the **3-Stage Visual Timeline**:
   - Problem Reported ➔ Work In Progress ➔ Resolved & Closed.
2. Point out the **Official Status History & Audit Trail** with department timestamps.
3. Hover over the **Smart Priority Badge** (e.g. `Score: 9/10`) to show the transparent tooltip explaining every score point (Base Urgency + Safety Keywords + Community Confirmations).
4. Click **"I Also Face This Problem"** to show instant reactive upvoting.

---

### Step 6: Municipal Admin Management Hub (45 Seconds)
1. Toggle to **"Admin View"** in the top navigation bar.
2. Point out the municipal operations console:
   - **Quick Status Transitions**: Click the *"In Progress"* or *"Resolved"* pills in the table to show 1-click status changes.
   - Click **"Manage"** on any row to open the status modal. Add an official resolution comment: `"Repairs completed by Public Works Crew #14. Road resurfaced and opened to traffic."`
   - Save and return to the citizen view to show that the resolution comment and status timeline immediately updated!
3. Click **"Export CSV"** to demonstrate how maintenance dispatchers can export complaint records with GPS coordinates for field crews.
4. Show the **"Reset Demo Data"** button to restore sample presentation data at any point.

---

### Step 7: Dual-Mode Backend Architecture (15 Seconds)
1. Click the **"Demo Mode"** pill in the top navbar.
2. Show the Supabase Configuration Modal:
   - Explains that the app is currently running in zero-config `localStorage` demo mode.
   - Shows where judges or developers can paste their Supabase URL and Anon Key to switch to live cloud PostgreSQL without touching a terminal.
