/** Atomic feature catalog for the “Design your app” configurator. */

export type FeatureCategory =
  | 'scheduling'
  | 'maps'
  | 'bookingFlow'
  | 'estimate'
  | 'opsBoard'
  | 'fieldTools'
  | 'safety'

export type ExclusionGroup = 'primaryFlow' | 'calendarDepth' | 'hailStyle'

export type LayoutRegion =
  | 'chrome'
  | 'kpi'
  | 'map'
  | 'schedule'
  | 'main'
  | 'side'
  | 'actions'

export interface CatalogFeature {
  id: string
  label: string
  clientDescription: string
  category: FeatureCategory
  layoutRegion: LayoutRegion
  /** At most one feature per group may be selected. */
  exclusionGroup?: ExclusionGroup
  /** Labels used when scoring overlap with DEMO_FEATURES pills. */
  matchLabels?: string[]
}

export const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  scheduling: 'Scheduling',
  maps: 'Maps & place',
  bookingFlow: 'Booking flow',
  estimate: 'Estimate',
  opsBoard: 'Ops board',
  fieldTools: 'Field tools',
  safety: 'Safety & gates',
}

export const LAYOUT_REGION_ORDER: LayoutRegion[] = [
  'chrome',
  'kpi',
  'map',
  'schedule',
  'main',
  'side',
  'actions',
]

export const LAYOUT_REGION_LABELS: Record<LayoutRegion, string> = {
  chrome: 'App header',
  kpi: 'KPI / status strip',
  map: 'Map',
  schedule: 'Schedule',
  main: 'Main workspace',
  side: 'Side panel',
  actions: 'Actions',
}

export const FEATURE_CATALOG: CatalogFeature[] = [
  // —— Booking flow (primary shapes) ——
  {
    id: 'wizard-steps',
    label: 'Step-by-step wizard',
    clientDescription: 'Guide customers through a booking or quote in clear steps.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    exclusionGroup: 'primaryFlow',
    matchLabels: ['Wizard steps', 'Package wizard', 'Phase steps'],
  },
  {
    id: 'job-board',
    label: 'Job / trade board',
    clientDescription: 'Pin job types on one board and advance work through columns.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    exclusionGroup: 'primaryFlow',
    matchLabels: ['Job chips', 'Kanban columns', 'Trade quick-adds'],
  },
  {
    id: 'floor-plan',
    label: 'Floor plan rooms',
    clientDescription: 'Customers tap a room on a venue floor plan to start a hire.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    exclusionGroup: 'primaryFlow',
    matchLabels: ['Floor plan rooms'],
  },
  {
    id: 'catalog',
    label: 'Catalog with quantities',
    clientDescription: 'Browse items (trees, surfaces, rides) and set how many of each.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    exclusionGroup: 'primaryFlow',
    matchLabels: ['Tree catalog', 'Qty steppers', 'Exercise catalog'],
  },
  {
    id: 'tile-grid',
    label: 'Tile / zone grid',
    clientDescription: 'Count work on a grid of zones or species tiles with counters.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    exclusionGroup: 'primaryFlow',
    matchLabels: ['Species tiles', 'Tile counters', 'Zone picker A1–D4'],
  },
  {
    id: 'field-log',
    label: 'Field visit log',
    clientDescription: 'Staff log work on site — tasks, notes, and close-out checks.',
    category: 'fieldTools',
    layoutRegion: 'main',
    exclusionGroup: 'primaryFlow',
    matchLabels: ['Phone shell', 'Grouped tasks', 'FAB log action'],
  },

  // —— Hail style ——
  {
    id: 'phone-hail',
    label: 'Phone hail',
    clientDescription: 'Quick pickup/drop-off ride request with fare on a phone-style screen.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    exclusionGroup: 'hailStyle',
    matchLabels: ['Pickup/drop-off', 'Fare breakdown', 'Saved places'],
  },
  {
    id: 'place-grid',
    label: 'Place-to-place board',
    clientDescription: 'Pick From/To on a place grid with vehicles and time slots.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    exclusionGroup: 'hailStyle',
    matchLabels: ['Place grid', 'Vehicle cards', 'Time slot rail'],
  },

  // —— Scheduling ——
  {
    id: 'day-rail',
    label: 'Day rail',
    clientDescription: 'Scrollable strip of upcoming days to pick a date.',
    category: 'scheduling',
    layoutRegion: 'schedule',
    exclusionGroup: 'calendarDepth',
    matchLabels: ['Day rail', 'Day navigation'],
  },
  {
    id: 'week-nav',
    label: 'Week calendar nav',
    clientDescription: 'Jump prev/next week for roster and admin schedules.',
    category: 'scheduling',
    layoutRegion: 'schedule',
    exclusionGroup: 'calendarDepth',
    matchLabels: ['Week calendar nav'],
  },
  {
    id: 'rooms-hours-grid',
    label: 'Rooms × hours grid',
    clientDescription: 'Staff board showing each room against hourly slots.',
    category: 'scheduling',
    layoutRegion: 'main',
    exclusionGroup: 'calendarDepth',
    matchLabels: ['Rooms × hours grid'],
  },
  {
    id: 'horse-day-grid',
    label: 'Resource × day grid',
    clientDescription: 'Plan horses, rooms, or assets across days on one planner.',
    category: 'scheduling',
    layoutRegion: 'main',
    exclusionGroup: 'calendarDepth',
    matchLabels: ['Horse × day grid', 'Roster grid', 'Carers × hours grid'],
  },
  {
    id: 'time-rail',
    label: 'Time rail',
    clientDescription: 'Choose a start time from available slots.',
    category: 'scheduling',
    layoutRegion: 'schedule',
    matchLabels: ['Time rail', 'Time slot rail'],
  },
  {
    id: 'occupancy-strip',
    label: 'Occupancy strip',
    clientDescription: 'See how full each day is before you pick.',
    category: 'scheduling',
    layoutRegion: 'schedule',
    matchLabels: ['Occupancy strip'],
  },
  {
    id: 'calendar-grid',
    label: 'Calendar grid',
    clientDescription: 'Full day/time grid for packages or blocked dates.',
    category: 'scheduling',
    layoutRegion: 'schedule',
    matchLabels: ['Calendar grid', 'Calendar blocks'],
  },

  // —— Maps ——
  {
    id: 'cluster-map',
    label: 'Cluster / site map',
    clientDescription: 'Map of yards, households, or sites with selectable markers.',
    category: 'maps',
    layoutRegion: 'map',
    matchLabels: ['Cluster map', 'Household map'],
  },
  {
    id: 'route-map',
    label: 'Route map',
    clientDescription: 'Show a sailing, ride, or road route on a map.',
    category: 'maps',
    layoutRegion: 'map',
    matchLabels: ['Route map', 'Route-first map', 'Road-snapped map'],
  },
  {
    id: 'saved-places',
    label: 'Saved places',
    clientDescription: 'Quick-pick common pickup and drop-off locations.',
    category: 'maps',
    layoutRegion: 'main',
    matchLabels: ['Saved places'],
  },

  // —— Estimate ——
  {
    id: 'live-estimate',
    label: 'Live estimate',
    clientDescription: 'Price or ballpark updates as they choose options.',
    category: 'estimate',
    layoutRegion: 'side',
    matchLabels: ['Live estimate', 'Side estimate', 'Fare breakdown'],
  },
  {
    id: 'credit-wallet',
    label: 'Credit / pack wallet',
    clientDescription: 'Prepaid credits that burn when members book a class.',
    category: 'estimate',
    layoutRegion: 'chrome',
    matchLabels: ['Credit wallet', 'Prepaid plans'],
  },
  {
    id: 'ballpark-export',
    label: 'Ballpark export',
    clientDescription: 'Copy or print a rough quote for the customer.',
    category: 'estimate',
    layoutRegion: 'actions',
    matchLabels: ['Ballpark export'],
  },
  {
    id: 'extras-addons',
    label: 'Extras & add-ons',
    clientDescription: 'Optional extras (AV kit, stay nights, primers) on the quote.',
    category: 'estimate',
    layoutRegion: 'main',
    matchLabels: ['Extras chips', 'Add-ons', 'Stay add-on'],
  },

  // —— Ops board ——
  {
    id: 'kpi-header',
    label: 'KPI header',
    clientDescription: 'Top strip of counts — holds, gaps, utilisation, reminders.',
    category: 'opsBoard',
    layoutRegion: 'kpi',
    matchLabels: ['KPI header', 'Coverage hero', 'Coverage banner'],
  },
  {
    id: 'admin-tabs',
    label: 'Admin tabs',
    clientDescription: 'Switch between schedule, staff, clients, and rules.',
    category: 'opsBoard',
    layoutRegion: 'chrome',
    matchLabels: ['Admin tabs'],
  },
  {
    id: 'search-filters',
    label: 'Search & filters',
    clientDescription: 'Find bookings by name and filter by status or room.',
    category: 'opsBoard',
    layoutRegion: 'schedule',
    matchLabels: ['Search board', 'Status filters', 'Yard filter chips', 'Uncovered filter'],
  },
  {
    id: 'find-next',
    label: 'Find next event',
    clientDescription: 'Jump to the next matching hold, visit, or booking.',
    category: 'opsBoard',
    layoutRegion: 'schedule',
    matchLabels: ['Find next booking'],
  },
  {
    id: 'staff-assignee',
    label: 'Staff assignee',
    clientDescription: 'Assign a person to a room, visit, horse, or yard.',
    category: 'opsBoard',
    layoutRegion: 'main',
    matchLabels: ['Staff assignee', 'Staff role assign', 'Groom assignee', 'Substitute instructor'],
  },
  {
    id: 'status-cycle',
    label: 'Status cycle',
    clientDescription: 'Tap to move hold → confirmed → blocked (or visit pipeline).',
    category: 'opsBoard',
    layoutRegion: 'main',
    matchLabels: ['Status cycle', 'Status pipeline'],
  },
  {
    id: 'fill-bars',
    label: 'Capacity fill bars',
    clientDescription: 'See how full a class or slot is with urgency colours.',
    category: 'opsBoard',
    layoutRegion: 'main',
    matchLabels: ['Fill bars', 'Fill urgency', 'Class caps', 'Class cap'],
  },
  {
    id: 'kanban',
    label: 'Kanban columns',
    clientDescription: 'Advance jobs across New → Scheduled → On site → Done.',
    category: 'opsBoard',
    layoutRegion: 'main',
    matchLabels: ['Kanban columns'],
  },
  {
    id: 'coverage-tools',
    label: 'Coverage tools',
    clientDescription: 'Spot gaps, suggest staff, or auto-fill uncovered visits.',
    category: 'opsBoard',
    layoutRegion: 'kpi',
    matchLabels: ['Suggest carer', 'Coverage auto-fill', 'Bulk assign'],
  },

  // —— Field tools ——
  {
    id: 'checklists',
    label: 'Checklists',
    clientDescription: 'Tick setup, treatment, close-out, or safety items.',
    category: 'fieldTools',
    layoutRegion: 'main',
    matchLabels: [
      'Setup checklist',
      'Treatment checklist',
      'Close-out checklist',
      'Safety checklist',
      'Equipment checklist',
      'Prep checklist',
    ],
  },
  {
    id: 'fab-action',
    label: 'Quick action button',
    clientDescription: 'Floating button to log the next field action fast.',
    category: 'fieldTools',
    layoutRegion: 'actions',
    matchLabels: ['FAB log action'],
  },
  {
    id: 'assigned-banner',
    label: 'Assigned work banner',
    clientDescription: 'Show what is on today’s roster for this field worker.',
    category: 'fieldTools',
    layoutRegion: 'kpi',
    matchLabels: ['Assigned banner', 'My roster tab', 'Today tab'],
  },
  {
    id: 'meds-tasks',
    label: 'Meds & care tasks',
    clientDescription: 'Meds due and grouped care tasks for a household visit.',
    category: 'fieldTools',
    layoutRegion: 'main',
    matchLabels: ['Meds due', 'Grouped tasks', 'Family hand-off'],
  },
  {
    id: 'photo-stub',
    label: 'Photo attach',
    clientDescription: 'Attach a site photo to a ticket or visit (demo stub).',
    category: 'fieldTools',
    layoutRegion: 'actions',
    matchLabels: ['Photo stub'],
  },

  // —— Safety & gates ——
  {
    id: 'weather-gate',
    label: 'Weather / conditions gate',
    clientDescription: 'Block or warn when tide, wind, swell, or weather is unsafe.',
    category: 'safety',
    layoutRegion: 'kpi',
    matchLabels: ['Tide window strip', 'Tide/sun windows', 'Wind/swell gate', 'Weather cues', 'Weather window'],
  },
  {
    id: 'waiver-gate',
    label: 'Waiver / briefing gate',
    clientDescription: 'Require waiver or safety briefing before confirm.',
    category: 'safety',
    layoutRegion: 'actions',
    matchLabels: ['Waiver gate', 'Safety briefing'],
  },
  {
    id: 'party-size',
    label: 'Party / passenger size',
    clientDescription: 'Set how many people are on the booking.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    matchLabels: ['Party stepper', 'Party size', 'Passenger chips', 'Crew stepper'],
  },
  {
    id: 'recurring',
    label: 'Recurring booking',
    clientDescription: 'Option to repeat a hire or class on a schedule.',
    category: 'bookingFlow',
    layoutRegion: 'main',
    matchLabels: ['Recurring toggle'],
  },
  {
    id: 'waitlist',
    label: 'Waitlist when full',
    clientDescription: 'Join a waitlist when a class or slot is at capacity.',
    category: 'bookingFlow',
    layoutRegion: 'actions',
    matchLabels: ['Waitlist join', 'Almost-full cue'],
  },
  {
    id: 'colour-prefs',
    label: 'Colour preferences',
    clientDescription: 'Staff can switch calendar colours (high contrast, colourblind-safe).',
    category: 'opsBoard',
    layoutRegion: 'chrome',
    matchLabels: ['Colour prefs'],
  },
]

export const FEATURE_BY_ID: Record<string, CatalogFeature> = Object.fromEntries(
  FEATURE_CATALOG.map((f) => [f.id, f]),
)

export function featuresByCategory(): { category: FeatureCategory; label: string; features: CatalogFeature[] }[] {
  const order: FeatureCategory[] = [
    'bookingFlow',
    'scheduling',
    'maps',
    'estimate',
    'opsBoard',
    'fieldTools',
    'safety',
  ]
  return order.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    features: FEATURE_CATALOG.filter((f) => f.category === category),
  }))
}

/** Toggle a feature on/off; enforces at-most-one per exclusion group. */
export function toggleFeature(selected: string[], id: string): string[] {
  if (selected.includes(id)) {
    return selected.filter((x) => x !== id)
  }
  const feature = FEATURE_BY_ID[id]
  if (!feature) return selected
  let next = [...selected, id]
  if (feature.exclusionGroup) {
    const group = feature.exclusionGroup
    next = next.filter((otherId) => {
      if (otherId === id) return true
      return FEATURE_BY_ID[otherId]?.exclusionGroup !== group
    })
  }
  return next
}

/** True if this feature is blocked only by a different pick in its group (for UI hint). */
export function conflictsWithSelection(selected: string[], id: string): CatalogFeature | null {
  const feature = FEATURE_BY_ID[id]
  if (!feature?.exclusionGroup || selected.includes(id)) return null
  const rival = selected.find((sid) => FEATURE_BY_ID[sid]?.exclusionGroup === feature.exclusionGroup)
  return rival ? FEATURE_BY_ID[rival] ?? null : null
}

export function composeWireframe(selected: string[]): { region: LayoutRegion; title: string; items: CatalogFeature[] }[] {
  const features = selected.map((id) => FEATURE_BY_ID[id]).filter(Boolean) as CatalogFeature[]
  const byRegion = new Map<LayoutRegion, CatalogFeature[]>()
  for (const f of features) {
    const list = byRegion.get(f.layoutRegion) ?? []
    list.push(f)
    byRegion.set(f.layoutRegion, list)
  }
  return LAYOUT_REGION_ORDER.filter((r) => byRegion.has(r)).map((region) => ({
    region,
    title: LAYOUT_REGION_LABELS[region],
    items: byRegion.get(region)!,
  }))
}

export interface ClosestDemo {
  path: string
  title: string
  score: number
}

const DEMO_TITLES: Record<string, string> = {
  '/venue/harbourbook': 'Harbour Book',
  '/venue/hallboard': 'Hall Board',
  '/beekeeping/hiverun': 'Hive Run',
  '/beekeeping/apiary': 'Apiary Board',
  '/homecare/visit': 'Care Visit',
  '/homecare/rounds': 'Round Board',
  '/fitness/studioflow': 'Studio Flow',
  '/fitness/classboard': 'Class Board',
  '/riding/shoreride': 'Shore Ride',
  '/riding/yardboard': 'Yard Board',
  '/yacht/coastal': 'Coastal Charter',
  '/yacht/adventure': 'Bay Adventure',
  '/taxi/mohua': 'Mohua Ride',
  '/taxi/bayhop': 'Bay Hop',
  '/handyman/bayfix': 'Bay Fix',
  '/handyman/tradeboard': 'Trade Board',
  '/pruning/canopy': 'Canopy Care',
  '/pruning/orchard': 'Orchard Grid',
  '/painting/freshcoat': 'Fresh Coat',
  '/painting/paintboard': 'Paint Board',
}

/** Score selected catalog features against demo pill lists. */
export function findClosestDemos(
  selected: string[],
  demoFeatures: Record<string, { features: string[] }>,
  limit = 2,
): ClosestDemo[] {
  if (!selected.length) return []
  const matchSet = new Set<string>()
  for (const id of selected) {
    const f = FEATURE_BY_ID[id]
    if (!f) continue
    matchSet.add(f.label)
    for (const m of f.matchLabels ?? []) matchSet.add(m)
  }
  const scored: ClosestDemo[] = []
  for (const [path, meta] of Object.entries(demoFeatures)) {
    let score = 0
    for (const pill of meta.features) {
      if (matchSet.has(pill)) score += 1
      else {
        for (const m of matchSet) {
          if (pill.includes(m) || m.includes(pill)) {
            score += 0.5
            break
          }
        }
      }
    }
    if (score > 0) {
      scored.push({ path, title: DEMO_TITLES[path] ?? path, score })
    }
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}

export function buildMailtoBrief(businessName: string, selected: string[]): string {
  const name = businessName.trim() || 'Your business'
  const labels = selected
    .map((id) => FEATURE_BY_ID[id]?.label)
    .filter(Boolean)
    .join('\n- ')
  const subject = encodeURIComponent(`App sketch — ${name}`)
  const body = encodeURIComponent(
    `Hi Warwick,\n\nHere's a sketch for ${name}.\n\nFeatures:\n- ${labels || '(none selected)'}\n\n(Generated from the GBTech sim configurator — happy to refine with you.)\n`,
  )
  return `mailto:warwick.marshall@gmail.com?subject=${subject}&body=${body}`
}
