export type LatLng = [number, number]

export interface SailingRoute {
  id: string
  name: string
  blurb: string
  durationHint: string
  path: LatLng[]
  center: LatLng
  zoom: number
}

/** Approximate Golden Bay / Abel Tasman approaches — demo only. */
export const SAILING_ROUTES: SailingRoute[] = [
  {
    id: 'coastal',
    name: 'Coastal cruise',
    blurb: 'Tākaka estuary out toward Separation Point — calm water, wildlife spotting.',
    durationHint: '3–4 hrs',
    center: [-40.82, 172.85],
    zoom: 11,
    path: [
      [-40.855, 172.808],
      [-40.84, 172.83],
      [-40.82, 172.86],
      [-40.8, 172.89],
      [-40.79, 172.92],
    ],
  },
  {
    id: 'island',
    name: 'Island loop',
    blurb: 'Wider loop toward Abel Tasman approaches — more exposure, bigger views.',
    durationHint: '5–6 hrs',
    center: [-40.8, 172.92],
    zoom: 10,
    path: [
      [-40.855, 172.808],
      [-40.83, 172.85],
      [-40.78, 172.95],
      [-40.76, 173.02],
      [-40.79, 172.98],
      [-40.84, 172.88],
      [-40.855, 172.808],
    ],
  },
]
