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

/**
 * Water-only Golden Bay / Abel Tasman approaches — demo paths stay in estuary
 * channels and open bay (not over land). Coordinates approximate; simulated only.
 */
export const SAILING_ROUTES: SailingRoute[] = [
  {
    id: 'coastal',
    name: 'Coastal cruise',
    blurb: 'Leave the Waitapu estuary channel, hug the Motupipi / Pōhara coast, then ease toward Separation Point approaches — calm water, wildlife spotting.',
    durationHint: '3–4 hrs',
    center: [-40.82, 172.88],
    zoom: 11,
    path: [
      // Waitapu estuary mouth (channel)
      [-40.842, 172.825],
      [-40.838, 172.838],
      [-40.834, 172.855],
      // Offshore of Pōhara / Tata beach strip
      [-40.828, 172.875],
      [-40.822, 172.895],
      [-40.815, 172.915],
      // Toward Separation Point approaches (still in bay water)
      [-40.805, 172.935],
      [-40.795, 172.955],
    ],
  },
  {
    id: 'island',
    name: 'Island loop',
    blurb: 'Wider open-water loop into Golden Bay then back via Abel Tasman approaches — more exposure, bigger views. Path stays offshore.',
    durationHint: '5–6 hrs',
    center: [-40.78, 172.95],
    zoom: 10,
    path: [
      [-40.842, 172.825],
      [-40.835, 172.86],
      [-40.82, 172.9],
      [-40.8, 172.95],
      [-40.775, 173.0],
      [-40.755, 173.04],
      // Turn back in open water (Adele / Fisherman approaches area)
      [-40.765, 173.06],
      [-40.79, 173.02],
      [-40.81, 172.97],
      [-40.83, 172.91],
      [-40.838, 172.86],
      [-40.842, 172.825],
    ],
  },
]
