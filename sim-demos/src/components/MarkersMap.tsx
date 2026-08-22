import { useEffect, useId, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from '../shared/sailingRoutes'

export interface MapPoint {
  id: string
  lat: number
  lng: number
  label: string
  selected?: boolean
}

interface Props {
  points: MapPoint[]
  center: LatLng
  zoom?: number
  className?: string
  pathColor?: string
  label?: string
  onSelect?: (id: string) => void
}

/** Multi-marker map for field sites (hive yards, care homes) — not a route line. */
export function MarkersMap({
  points,
  center,
  zoom = 10,
  className,
  pathColor = '#DAA520',
  label,
  onSelect,
}: Props) {
  const id = useId().replace(/:/g, '')
  const mapRef = useRef<L.Map | null>(null)
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect
  const pointsKey = points.map((p) => `${p.id}:${p.selected ? 1 : 0}`).join('|')

  useEffect(() => {
    const el = document.getElementById(`demo-markers-${id}`)
    if (!el) return

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const map = L.map(el, { scrollWheelZoom: false, attributionControl: true })
    mapRef.current = map
    map.setView(center, zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map)

    const markers: L.CircleMarker[] = []
    points.forEach((p) => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: p.selected ? 10 : 7,
        color: pathColor,
        fillColor: p.selected ? pathColor : '#fff',
        fillOpacity: p.selected ? 1 : 0.9,
        weight: 3,
      }).addTo(map)
      marker.bindTooltip(p.label, { permanent: false })
      marker.on('click', () => selectRef.current?.(p.id))
      markers.push(marker)
    })

    if (points.length > 1) {
      map.fitBounds(
        L.latLngBounds(points.map((p) => [p.lat, p.lng] as LatLng)),
        { padding: [28, 28] },
      )
    } else if (points[0]) {
      map.setView([points[0].lat, points[0].lng], zoom)
    }

    return () => {
      markers.forEach((m) => m.remove())
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pointsKey captures selection/ids
  }, [id, pointsKey, center, zoom, pathColor])

  return (
    <div className="map-route-wrap">
      <div
        id={`demo-markers-${id}`}
        className={className ?? 'demo-map'}
        role="img"
        aria-label={label ?? 'Site map'}
      />
      {label && <p className="map-route-label">{label}</p>}
    </div>
  )
}
