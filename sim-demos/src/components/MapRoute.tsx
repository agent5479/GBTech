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
  /** Small caption under the map (e.g. road vs water route). */
  label?: string
}

export function MapRoute({ path, center, zoom, className, pathColor = '#D3993C', label }: Props) {
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

    const fit = () => {
      if (path.length >= 2) {
        const line = L.polyline(path, { color: pathColor, weight: 4, opacity: 0.9 }).addTo(map)
        L.circleMarker(path[0], { radius: 6, color: pathColor, fillColor: '#fff', fillOpacity: 1 }).addTo(map)
        const end = path[path.length - 1]
        L.circleMarker(end, { radius: 6, color: pathColor, fillColor: pathColor, fillOpacity: 1 }).addTo(map)
        map.fitBounds(line.getBounds(), { padding: [24, 24] })
        return line
      }
      if (path[0]) {
        L.circleMarker(path[0], { radius: 7, color: pathColor, fillColor: pathColor, fillOpacity: 0.85 }).addTo(map)
        map.setView(path[0], zoom)
      }
      return null
    }
    const line = fit()

    const syncSize = () => {
      map.invalidateSize({ animate: false })
      if (line) map.fitBounds(line.getBounds(), { padding: [24, 24] })
    }
    const raf = requestAnimationFrame(syncSize)
    const t = window.setTimeout(syncSize, 120)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null
    ro?.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      ro?.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [id, path, center, zoom, pathColor])

  return (
    <div className="map-route-wrap">
      <div id={`demo-map-${id}`} className={className ?? 'demo-map'} role="img" aria-label={label ?? 'Route map'} />
      {label && <p className="map-route-label">{label}</p>}
    </div>
  )
}
