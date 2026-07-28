export interface GbPlace {
  id: string
  name: string
  lat: number
  lng: number
}

export const GB_PLACES: GbPlace[] = [
  { id: 'takaka', name: 'Tākaka town', lat: -40.855, lng: 172.808 },
  { id: 'pohara', name: 'Pōhara Beach', lat: -40.837, lng: 172.889 },
  { id: 'collingwood', name: 'Collingwood', lat: -40.682, lng: 172.683 },
  { id: 'waitapu', name: 'Waitapu Bridge', lat: -40.848, lng: 172.82 },
  { id: 'tata', name: 'Tata Beach', lat: -40.81, lng: 172.91 },
  { id: 'airport', name: 'Tākaka Aerodrome', lat: -40.813, lng: 172.775 },
  { id: 'patons', name: "Patons Rock", lat: -40.79, lng: 172.76 },
]

function toRad(d: number) {
  return (d * Math.PI) / 180
}

/** Haversine distance in km. */
export function distanceKm(a: GbPlace, b: GbPlace): number {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10
}

export function placeById(id: string): GbPlace | undefined {
  return GB_PLACES.find((p) => p.id === id)
}
