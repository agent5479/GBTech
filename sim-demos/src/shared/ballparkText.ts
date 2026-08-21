import {
  formatPaintBracket,
  paintTypeById,
  undercoatById,
  type PaintEstimate,
  type PaintSetting,
} from './paintingQuote'

export function ballparkTitle(setting: PaintSetting): string {
  return setting === 'indoor' ? 'Indoor rooms' : 'Exterior surfaces & roof'
}

export function formatBallparkText(estimate: PaintEstimate): string {
  const paint = paintTypeById(estimate.paintTypeId)?.name ?? estimate.paintTypeId
  const undercoat =
    estimate.undercoatId === 'none'
      ? 'No undercoat'
      : (undercoatById(estimate.undercoatId)?.name ?? estimate.undercoatId)

  const lines = [
    'GBTech — Ballpark estimate (demo)',
    '(Impression only — not a confirmed quote or booking.)',
    '',
    ballparkTitle(estimate.setting),
    `Date: ${new Date().toLocaleDateString('en-NZ')}`,
    '',
    'Surfaces',
    ...estimate.lines.map(
      (line) =>
        `• ${line.label}: ${line.paintableM2} m²` +
        (line.measuredM2 !== line.paintableM2 ? ` (${line.measuredM2} m² measured)` : ''),
    ),
    '',
    `Paint system: ${paint}`,
    `Undercoat: ${undercoat}`,
    `Measured area: ${estimate.measuredM2} m²`,
    `Paintable area: ${estimate.paintableM2} m²`,
    '',
    `Labour & materials: $${(estimate.labour + estimate.materials).toFixed(2)}`,
    `Setup: $${estimate.setupFee.toFixed(2)}`,
    `Travel (Golden Bay): $${estimate.travelFee.toFixed(2)}`,
  ]

  if (estimate.outdoorSurcharge > 0) {
    lines.push(`Exterior surcharge: $${estimate.outdoorSurcharge.toFixed(2)}`)
  }
  if (estimate.roofAccessFee > 0) {
    lines.push(`Roof access: $${estimate.roofAccessFee.toFixed(2)}`)
  }

  lines.push(
    '',
    `Estimated cost: ${formatPaintBracket(estimate)}`,
    '',
    'A painter confirms the real number on site.',
    'Simulated demo — GBTech',
  )

  return lines.join('\n')
}

export async function copyBallparkText(estimate: PaintEstimate): Promise<boolean> {
  const text = formatBallparkText(estimate)
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
