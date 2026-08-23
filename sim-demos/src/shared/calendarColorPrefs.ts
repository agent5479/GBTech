const STORAGE_KEY = 'gbtech-cal-colors'

export type CalColorScheme = 'default' | 'highContrast' | 'colorblind'

export const CAL_COLOR_SCHEMES: { id: CalColorScheme; label: string }[] = [
  { id: 'default', label: 'Default colours' },
  { id: 'highContrast', label: 'High contrast' },
  { id: 'colorblind', label: 'Colourblind-safe' },
]

export function loadCalColorScheme(): CalColorScheme {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'highContrast' || v === 'colorblind' || v === 'default') return v
  } catch {
    /* ignore */
  }
  return 'default'
}

export function saveCalColorScheme(scheme: CalColorScheme) {
  try {
    localStorage.setItem(STORAGE_KEY, scheme)
  } catch {
    /* ignore */
  }
}
