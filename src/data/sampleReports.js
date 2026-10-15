// Realistic Sample Data for CivicFix Demo Mode
// High-quality imagery with SVG fallback options for offline resilience

export const CATEGORIES = [
  { id: 'roads', label: 'Potholes & Roads', icon: 'Construction', color: 'orange' },
  { id: 'garbage', label: 'Garbage & Sanitation', icon: 'Trash2', color: 'emerald' },
  { id: 'lighting', label: 'Streetlights & Electrical', icon: 'Lightbulb', color: 'amber' },
  { id: 'water', label: 'Water Leakage & Drainage', icon: 'Droplets', color: 'blue' },
  { id: 'infrastructure', label: 'Public Infrastructure', icon: 'Building2', color: 'purple' },
  { id: 'other', label: 'Other Civic Issues', icon: 'AlertCircle', color: 'slate' }
];

export const STATUS_OPTIONS = [
  { id: 'Reported', label: 'Reported', color: 'amber', description: 'Complaint received and pending initial municipal review' },
  { id: 'In Progress', label: 'In Progress', color: 'blue', description: 'Work order dispatched to municipal maintenance crew' },
  { id: 'Resolved', label: 'Resolved', color: 'emerald', description: 'Work verified completed by municipal inspector' }
];

export const URGENCY_OPTIONS = [
  { id: 'Low', label: 'Low Urgency', points: 1, color: 'slate', desc: 'Non-hazardous aesthetic or minor defect' },
  { id: 'Medium', label: 'Medium Urgency', points: 2, color: 'amber', desc: 'Disruptive issue requiring prompt attention' },
  { id: 'High', label: 'High Urgency', points: 3, color: 'red', desc: 'Active safety hazard to pedestrians or traffic' }
];

// Preset photos for easy 1-click photo selection during demo presentations
export const PRESET_PHOTOS = [
  {
    name: 'Deep Road Pothole',
    category: 'roads',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Overflowing Bins',
    category: 'garbage',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Broken Streetlight',
    category: 'lighting',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Waterlogging & Burst Pipe',
    category: 'water',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Damaged Sidewalk Railing',
    category: 'infrastructure',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_REPORTS = [
  {
    id: 'rep-001',
    complaint_id: 'CF-2026-1042',
    title: 'Hazardous deep pothole on Market & 4th Cross',
    description: 'A deep pothole (approx 8 inches deep) has developed right in the middle of the bus lane. Two cyclists were injured yesterday evening trying to swerve around it during rush hour.',
    category: 'roads',
    photo_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    location_name: 'Market Street & 4th Crossway, Civic Center',
    latitude: 37.7833,
    longitude: -122.4089,
    urgency: 'High',
    priority_score: 9,
    score_reasons: ['Base High Urgency (+3)', 'Traffic & Cyclist Safety Risk (+3)', '3 Community Confirmations (+3)'],
    status: 'Reported',
    upvotes: 7,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    resolution_comment: '',
    status_history: [
      {
        id: 'sh-101',
        status: 'Reported',
        comment: 'Complaint logged into CivicFix portal by citizen.',
        changed_by: 'Citizen',
        created_at: new Date(Date.now() - 3600000 * 18).toISOString()
      }
    ]
  },
  {
    id: 'rep-002',
    complaint_id: 'CF-2026-1043',
    title: 'Overflowing commercial waste containers attracting pests',
    description: 'Three large commercial waste containers have not been collected for over 6 days. Trash has spilled across the pedestrian walkway, causing bad odors and attracting stray animals.',
    category: 'garbage',
    photo_url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    location_name: 'Behind Greenview Plaza, 8th Avenue',
    latitude: 37.7765,
    longitude: -122.4168,
    urgency: 'Medium',
    priority_score: 6,
    score_reasons: ['Base Medium Urgency (+2)', 'Public Health & Sanitation Concern (+2)', 'Community Reports (+2)'],
    status: 'In Progress',
    upvotes: 4,
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    resolution_comment: 'Sanitation Dept Work Order #WM-849 issued. Truck dispatched for priority collection.',
    status_history: [
      {
        id: 'sh-201',
        status: 'Reported',
        comment: 'Issue submitted with photo proof.',
        changed_by: 'Citizen',
        created_at: new Date(Date.now() - 3600000 * 42).toISOString()
      },
      {
        id: 'sh-202',
        status: 'In Progress',
        comment: 'Sanitation Dept Work Order #WM-849 issued. Truck dispatched for priority collection.',
        changed_by: 'Admin (Sanitation Supervisor)',
        created_at: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ]
  },
  {
    id: 'rep-003',
    complaint_id: 'CF-2026-1044',
    title: 'Three consecutive streetlights dark creating unsafe alley',
    description: 'Entire residential block between Pine and Bush St is in complete darkness after dusk because 3 consecutive LED pole fixtures are burned out. Residents feel unsafe walking home.',
    category: 'lighting',
    photo_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    location_name: 'Pine Street near Elementary School Gate',
    latitude: 37.7892,
    longitude: -122.4112,
    urgency: 'Medium',
    priority_score: 5,
    score_reasons: ['Base Medium Urgency (+2)', 'Adjacent to Elementary School (+2)', 'Community Upvote (+1)'],
    status: 'Reported',
    upvotes: 3,
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    resolution_comment: '',
    status_history: [
      {
        id: 'sh-301',
        status: 'Reported',
        comment: 'Report registered for Electrical Maintenance Team.',
        changed_by: 'Citizen',
        created_at: new Date(Date.now() - 3600000 * 26).toISOString()
      }
    ]
  },
  {
    id: 'rep-004',
    complaint_id: 'CF-2026-1045',
    title: 'Severe underground main line water leak flooding intersection',
    description: 'Potable water pipe burst under the pavement is sending streams of pressurized water onto the road. Significant water wastage and localized flooding at the pedestrian crossing.',
    category: 'water',
    photo_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    location_name: 'Corner of 10th St & Folsom Blvd',
    latitude: 37.7721,
    longitude: -122.4124,
    urgency: 'High',
    priority_score: 9,
    score_reasons: ['Base High Urgency (+3)', 'Critical Infrastructure Resource Loss (+3)', 'Flooding Hazard (+3)'],
    status: 'In Progress',
    upvotes: 11,
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    resolution_comment: 'Emergency valve isolated by Water Board team. Road excavation and pipe replacement underway.',
    status_history: [
      {
        id: 'sh-401',
        status: 'Reported',
        comment: 'Citizen flagged high pressure water leak.',
        changed_by: 'Citizen',
        created_at: new Date(Date.now() - 3600000 * 14).toISOString()
      },
      {
        id: 'sh-402',
        status: 'In Progress',
        comment: 'Emergency valve isolated by Water Board team. Road excavation and pipe replacement underway.',
        changed_by: 'Admin (Water Supply Div)',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'rep-005',
    complaint_id: 'CF-2026-1046',
    title: 'Damaged steel pedestrian guardrail at busy crosswalk',
    description: 'Vehicle impact bent the sidewalk guardrail into the walking path. Jagged metal edges exposed near the public transit stop.',
    category: 'infrastructure',
    photo_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    location_name: 'Civic Plaza Transit Hub Exit B',
    latitude: 37.7818,
    longitude: -122.4155,
    urgency: 'Low',
    priority_score: 4,
    score_reasons: ['Base Low Urgency (+1)', 'Pedestrian Safety Edge (+2)', 'Verified by Staff (+1)'],
    status: 'Resolved',
    upvotes: 2,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    resolution_comment: 'Damaged rail segment removed and replaced with new standard galvanized safety barrier. Inspected and cleared.',
    status_history: [
      {
        id: 'sh-501',
        status: 'Reported',
        comment: 'Report created.',
        changed_by: 'Citizen',
        created_at: new Date(Date.now() - 3600000 * 72).toISOString()
      },
      {
        id: 'sh-502',
        status: 'In Progress',
        comment: 'Fabrication team assigned for replacement rails.',
        changed_by: 'Admin',
        created_at: new Date(Date.now() - 3600000 * 36).toISOString()
      },
      {
        id: 'sh-503',
        status: 'Resolved',
        comment: 'Damaged rail segment removed and replaced with new standard galvanized safety barrier. Inspected and cleared.',
        changed_by: 'Admin (Public Works)',
        created_at: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ]
  },
  {
    id: 'rep-006',
    complaint_id: 'CF-2026-1047',
    title: 'Illegal construction debris dumped along park trail',
    description: 'Approximately 2 tons of broken tiles, cement bags, and drywall dumped at the north park entrance, blocking wheelchair accessibility ramp.',
    category: 'garbage',
    photo_url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    location_name: 'North Park Entrance, Lakeview Road',
    latitude: 37.7871,
    longitude: -122.4225,
    urgency: 'High',
    priority_score: 8,
    score_reasons: ['Base High Urgency (+3)', 'ADA Accessibility Violation (+3)', 'Community Upvotes (+2)'],
    status: 'Reported',
    upvotes: 5,
    created_at: new Date(Date.now() - 3600000 * 11).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 11).toISOString(),
    resolution_comment: '',
    status_history: [
      {
        id: 'sh-601',
        status: 'Reported',
        comment: 'Report submitted by neighborhood committee.',
        changed_by: 'Citizen',
        created_at: new Date(Date.now() - 3600000 * 11).toISOString()
      }
    ]
  }
];
