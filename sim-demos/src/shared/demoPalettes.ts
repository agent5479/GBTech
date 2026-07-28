import type { CSSProperties } from 'react'

export interface DemoPalette {
  id: string
  label: string
  /** Swatch colours shown in the switcher */
  swatch: [string, string]
  accent: string
  accentInk: string
  bg: string
  text: string
  surface: string
}

/** Shared demo palettes — aesthetics are fully customisable for a real client brand. */
export const DEMO_PALETTES: DemoPalette[] = [
  {
    id: 'default',
    label: 'Demo default',
    swatch: ['#888888', '#e8e4dc'],
    accent: '',
    accentInk: '',
    bg: '',
    text: '',
    surface: '',
  },
  {
    id: 'slate',
    label: 'Slate',
    swatch: ['#334155', '#e2e8f0'],
    accent: '#334155',
    accentInk: '#f8fafc',
    bg: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
    text: '#0f172a',
    surface: 'rgba(255,255,255,0.85)',
  },
  {
    id: 'sand',
    label: 'Sand',
    swatch: ['#a16207', '#f5e6c8'],
    accent: '#a16207',
    accentInk: '#fffbeb',
    bg: 'linear-gradient(180deg, #faf6ef 0%, #efe4d0 100%)',
    text: '#292524',
    surface: 'rgba(255,255,255,0.75)',
  },
  {
    id: 'forest',
    label: 'Forest',
    swatch: ['#166534', '#dcfce7'],
    accent: '#166534',
    accentInk: '#f0fdf4',
    bg: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)',
    text: '#14532d',
    surface: 'rgba(255,255,255,0.8)',
  },
  {
    id: 'berry',
    label: 'Berry',
    swatch: ['#4B0D1C', '#D3993C'],
    accent: '#4B0D1C',
    accentInk: '#D3993C',
    bg: 'linear-gradient(180deg, #faf6f2 0%, #f0e6e8 100%)',
    text: '#2a0810',
    surface: 'rgba(255,255,255,0.8)',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    swatch: ['#0e7490', '#cffafe'],
    accent: '#0e7490',
    accentInk: '#ecfeff',
    bg: 'linear-gradient(180deg, #ecfeff 0%, #cffafe 100%)',
    text: '#164e63',
    surface: 'rgba(255,255,255,0.8)',
  },
  {
    id: 'night',
    label: 'Night',
    swatch: ['#c8f542', '#111111'],
    accent: '#c8f542',
    accentInk: '#111111',
    bg: 'linear-gradient(180deg, #141414 0%, #0a0a0a 100%)',
    text: '#f2f2f2',
    surface: '#1a1a1a',
  },
]

export function paletteById(id: string): DemoPalette {
  return DEMO_PALETTES.find((p) => p.id === id) ?? DEMO_PALETTES[0]
}

/** Inline CSS variables applied to each demo page root. */
export function paletteStyle(palette: DemoPalette): CSSProperties | undefined {
  if (palette.id === 'default' || !palette.accent) return undefined
  return {
    ['--accent' as string]: palette.accent,
    ['--demo-accent-ink' as string]: palette.accentInk,
    ['--demo-surface' as string]: palette.surface,
    background: palette.bg,
    color: palette.text,
  }
}
