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
 * Water-only Golden Bay sail polylines (Leaflet [lat, lng]).
 * Vertices and segment midpoints were checked seaward of OSM coastline —
 * paths leave Motupipi mouth, stay in open bay, and never cut across land.
 */
export const SAILING_ROUTES: SailingRoute[] = [
  {
    id: 'coastal',
    name: 'Coastal cruise',
    blurb:
      'Leave Motupipi mouth into open Golden Bay, then run offshore of Pōhara / Ligar / Tata toward Separation Point approaches — calm water, wildlife spotting.',
    durationHint: '3–4 hrs',
    center: [-40.79, 172.92],
    zoom: 11,
    path: [
      [-40.812, 172.835],
      [-40.805, 172.855],
      [-40.8, 172.875],
      [-40.795, 172.9],
      [-40.79, 172.925],
      [-40.785, 172.95],
      [-40.78, 172.975],
      [-40.775, 173.0],
    ],
  },
  {
    id: 'island',
    name: 'Island loop',
    blurb:
      'Wider open-water loop north into Golden Bay, toward Separation Point approaches, then home along a second offshore track — more exposure, bigger views.',
    durationHint: '5–6 hrs',
    center: [-40.77, 172.95],
    zoom: 10,
    path: [
      [-40.812, 172.835],
      [-40.8, 172.875],
      [-40.76, 172.9],
      [-40.74, 172.95],
      [-40.73, 173.0],
      [-40.735, 173.05],
      [-40.75, 173.06],
      [-40.76, 173.03],
      [-40.77, 172.99],
      [-40.78, 172.95],
      [-40.79, 172.91],
      [-40.8, 172.87],
      [-40.812, 172.835],
    ],
  },
]
