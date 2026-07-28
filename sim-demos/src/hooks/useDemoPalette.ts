import { useState } from 'react'
import type { CSSProperties } from 'react'
import { paletteById, paletteStyle, type DemoPalette } from '../shared/demoPalettes'

export function useDemoPalette(storageKey: string): {
  paletteId: string
  setPaletteId: (id: string) => void
  palette: DemoPalette
  style: CSSProperties | undefined
} {
  const [paletteId, setPaletteIdState] = useState(() => {
    try {
      return sessionStorage.getItem(`demo-palette:${storageKey}`) || 'default'
    } catch {
      return 'default'
    }
  })

  const setPaletteId = (id: string) => {
    setPaletteIdState(id)
    try {
      sessionStorage.setItem(`demo-palette:${storageKey}`, id)
    } catch {
      /* ignore */
    }
  }

  const palette = paletteById(paletteId)
  return { paletteId, setPaletteId, palette, style: paletteStyle(palette) }
}
