export type DemoRole = 'booking' | 'estimate' | 'ops'

export interface DemoFeatureMeta {
  role: DemoRole
  features: string[]
}

/** Sales showroom metadata keyed by demo route path. */
export const DEMO_FEATURES: Record<string, DemoFeatureMeta> = {
  '/venue/harbourbook': {
    role: 'booking',
    features: ['Setup checklist', 'Recurring toggle', 'Live estimate'],
  },
  '/venue/hallboard': {
    role: 'ops',
    features: ['Turnaround buffer', 'Free-slot coverage', 'Status pipeline'],
  },
  '/beekeeping/hiverun': {
    role: 'ops',
    features: ['Treatment checklist', 'Landowner call-first', 'Cluster map'],
  },
  '/beekeeping/apiary': {
    role: 'ops',
    features: ['Visit sequence', 'Overdue banner', 'Week roster grid'],
  },
  '/homecare/visit': {
    role: 'ops',
    features: ['Incident flag', 'Close-out checklist', 'Care-plan card'],
  },
  '/homecare/rounds': {
    role: 'ops',
    features: ['Travel gaps', 'Status pipeline', 'Coverage headline'],
  },
  '/fitness/studioflow': {
    role: 'booking',
    features: ['Credit wallet', 'Waitlist when full', 'Class cap'],
  },
  '/fitness/classboard': {
    role: 'ops',
    features: ['Substitute instructor', 'Equipment checklist', 'Fill bars'],
  },
  '/riding/shoreride': {
    role: 'booking',
    features: ['Tide window strip', 'Waiver gate', 'Horse picker'],
  },
  '/riding/yardboard': {
    role: 'ops',
    features: ['Groom assignee', 'Max-rides coverage', 'Rest toggles'],
  },
  '/yacht/coastal': {
    role: 'booking',
    features: ['Safety briefing', 'Weather cues', 'Package wizard'],
  },
  '/yacht/adventure': {
    role: 'ops',
    features: ['Wind/swell gate', 'Crew roles', 'Route-first map'],
  },
  '/taxi/mohua': {
    role: 'booking',
    features: ['Saved places', 'Fare breakdown', 'Road-snapped route'],
  },
  '/taxi/bayhop': {
    role: 'booking',
    features: ['Place grid', 'Dispatch queue', 'Vehicle cards'],
  },
  '/handyman/bayfix': {
    role: 'booking',
    features: ['Site access card', 'Photo stub', 'Multi-trade chips'],
  },
  '/handyman/tradeboard': {
    role: 'estimate',
    features: ['Job status pipeline', 'Live estimate', 'Day rail'],
  },
  '/pruning/canopy': {
    role: 'booking',
    features: ['Hazard flags', 'Qty steppers', 'Add-ons'],
  },
  '/pruning/orchard': {
    role: 'estimate',
    features: ['Zone picker A1–D4', 'Species tiles', 'Side estimate'],
  },
  '/painting/freshcoat': {
    role: 'estimate',
    features: ['Prep checklist', 'Surface editor', 'Ballpark export'],
  },
  '/painting/paintboard': {
    role: 'estimate',
    features: ['Weather window', 'Roof pitch', 'Cladding profiles'],
  },
}

export const ROLE_LABELS: Record<DemoRole, string> = {
  booking: 'Booking showcase',
  estimate: 'Estimate showcase',
  ops: 'Ops showcase',
}
