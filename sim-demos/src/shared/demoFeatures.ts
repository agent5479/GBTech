import type { PreviewFrame } from '../components/AppPreviewOverlay'

export type DemoRole = 'booking' | 'estimate' | 'ops'

export interface DemoFeatureMeta {
  role: DemoRole
  frame: PreviewFrame
  features: string[]
}

/** Sales showroom metadata keyed by demo route path. */
export const DEMO_FEATURES: Record<string, DemoFeatureMeta> = {
  '/venue/harbourbook': {
    role: 'booking',
    frame: 'browser',
    features: ['Setup checklist', 'Recurring toggle', 'Live estimate'],
  },
  '/venue/hallboard': {
    role: 'ops',
    frame: 'browser',
    features: ['Turnaround buffer', 'Free-slot coverage', 'Status pipeline'],
  },
  '/beekeeping/hiverun': {
    role: 'ops',
    frame: 'phone',
    features: ['Treatment checklist', 'Landowner call-first', 'Cluster map'],
  },
  '/beekeeping/apiary': {
    role: 'ops',
    frame: 'browser',
    features: ['Visit sequence', 'Overdue banner', 'Week roster grid'],
  },
  '/homecare/visit': {
    role: 'ops',
    frame: 'phone',
    features: ['Incident flag', 'Close-out checklist', 'Care-plan card'],
  },
  '/homecare/rounds': {
    role: 'ops',
    frame: 'browser',
    features: ['Travel gaps', 'Status pipeline', 'Coverage headline'],
  },
  '/fitness/studioflow': {
    role: 'booking',
    frame: 'browser',
    features: ['Credit wallet', 'Waitlist when full', 'Class cap'],
  },
  '/fitness/classboard': {
    role: 'ops',
    frame: 'browser',
    features: ['Substitute instructor', 'Equipment checklist', 'Fill bars'],
  },
  '/riding/shoreride': {
    role: 'booking',
    frame: 'phone',
    features: ['Tide window strip', 'Waiver gate', 'Horse picker'],
  },
  '/riding/yardboard': {
    role: 'ops',
    frame: 'browser',
    features: ['Groom assignee', 'Max-rides coverage', 'Rest toggles'],
  },
  '/yacht/coastal': {
    role: 'booking',
    frame: 'browser',
    features: ['Safety briefing', 'Weather cues', 'Package wizard'],
  },
  '/yacht/adventure': {
    role: 'ops',
    frame: 'browser',
    features: ['Wind/swell gate', 'Crew roles', 'Route-first map'],
  },
  '/taxi/mohua': {
    role: 'booking',
    frame: 'phone',
    features: ['Saved places', 'Fare breakdown', 'Road-snapped route'],
  },
  '/taxi/bayhop': {
    role: 'booking',
    frame: 'tablet',
    features: ['Place grid', 'Dispatch queue', 'Vehicle cards'],
  },
  '/handyman/bayfix': {
    role: 'booking',
    frame: 'browser',
    features: ['Site access card', 'Photo stub', 'Multi-trade chips'],
  },
  '/handyman/tradeboard': {
    role: 'estimate',
    frame: 'browser',
    features: ['Job status pipeline', 'Live estimate', 'Day rail'],
  },
  '/pruning/canopy': {
    role: 'booking',
    frame: 'browser',
    features: ['Hazard flags', 'Qty steppers', 'Add-ons'],
  },
  '/pruning/orchard': {
    role: 'estimate',
    frame: 'browser',
    features: ['Zone picker A1–D4', 'Species tiles', 'Side estimate'],
  },
  '/painting/freshcoat': {
    role: 'estimate',
    frame: 'browser',
    features: ['Prep checklist', 'Surface editor', 'Ballpark export'],
  },
  '/painting/paintboard': {
    role: 'estimate',
    frame: 'browser',
    features: ['Weather window', 'Roof pitch', 'Cladding profiles'],
  },
}

export const ROLE_LABELS: Record<DemoRole, string> = {
  booking: 'Booking showcase',
  estimate: 'Estimate showcase',
  ops: 'Ops showcase',
}
