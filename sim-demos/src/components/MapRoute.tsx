import { useEffect, useId, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from '../shared/sailingRoutes'

interface Props {
  path: LatLng[]
  center: LatLng
  zoom: number
  className?: string
  pathColor?: string
}

export function MapRoute({ path, center, zoom, className, pathColor = '#D3993C' }: Props) {
  const id = useId().replace(/:/g, '')
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    const el = document.getElementById(`demo-map-${id}`)
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

    const line = L.polyline(path, { color: pathColor, weight: 4, opacity: 0.9 }).addTo(map)
    if (path[0]) {
      L.circleMarker(path[0], { radius: 6, color: pathColor, fillColor: '#fff', fillOpacity: 1 }).addTo(map)
    }
    if (path.length > 1) {
      const end = path[path.length - 1]
      L.circleMarker(end, { radius: 6, color: pathColor, fillColor: pathColor, fillOpacity: 1 }).addTo(map)
    }
    map.fitBounds(line.getBounds(), { padding: [24, 24] })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [id, path, center, zoom, pathColor])

  return <div id={`demo-map-${id}`} className={className ?? 'demo-map'} role="img" aria-label="Route map" />
}
