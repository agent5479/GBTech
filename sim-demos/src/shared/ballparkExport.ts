import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ballparkTitle } from './ballparkText'
import { formatPaintBracket, paintTypeById, undercoatById, type PaintEstimate } from './paintingQuote'

type DocWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number }
}

export async function exportBallparkPdf(estimate: PaintEstimate): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' }) as DocWithAutoTable
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 16
  let y = 16

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(75, 13, 28)
  doc.text('GBTech', pageW - margin, y, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(58, 58, 58)
  doc.text('Simulated painting estimate · Golden Bay', pageW - margin, y + 6, { align: 'right' })

  y = 32
  doc.setFillColor(238, 243, 248)
  doc.roundedRect(margin, y, pageW - margin * 2, 16, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(26, 40, 52)
  doc.text('Ballpark estimate', margin + 4, y + 7)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(107, 107, 107)
  doc.text('Impression only — not a confirmed quote or booking.', margin + 4, y + 12)

  y = 58
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(47, 47, 47)
  doc.text(ballparkTitle(estimate.setting), margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Prepared ${new Date().toLocaleDateString('en-NZ')}`, pageW - margin, y, { align: 'right' })

  y += 8
  const paint = paintTypeById(estimate.paintTypeId)?.name ?? estimate.paintTypeId
  const undercoat =
    estimate.undercoatId === 'none'
      ? 'No undercoat'
      : (undercoatById(estimate.undercoatId)?.name ?? estimate.undercoatId)

  doc.text(`Paint system: ${paint}`, margin, y)
  y += 5
  doc.text(`Undercoat: ${undercoat}`, margin, y)
  y += 5
  doc.text(
    `Area: ${estimate.paintableM2} m² to paint` +
      (estimate.measuredM2 !== estimate.paintableM2 ? ` (${estimate.measuredM2} m² measured)` : ''),
    margin,
    y,
  )

  y += 8
  autoTable(doc, {
    startY: y,
    head: [['Surface', 'Measured m²', 'Paintable m²']],
    body: estimate.lines.map((line) => [
      line.label,
      line.measuredM2.toFixed(2),
      line.paintableM2.toFixed(2),
    ]),
    margin: { left: margin, right: margin },
    styles: { font: 'helvetica', fontSize: 9, textColor: [58, 58, 58], cellPadding: 2 },
    headStyles: { fillColor: [75, 13, 28], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      1: { halign: 'right', cellWidth: 28 },
      2: { halign: 'right', cellWidth: 28 },
    },
  })

  y = (doc.lastAutoTable?.finalY ?? y) + 8
  const fees: [string, string][] = [
    ['Labour & materials', `$${(estimate.labour + estimate.materials).toFixed(2)}`],
    ['Setup', `$${estimate.setupFee.toFixed(2)}`],
    ['Travel (Golden Bay)', `$${estimate.travelFee.toFixed(2)}`],
  ]
  if (estimate.outdoorSurcharge > 0) {
    fees.push(['Exterior surcharge', `$${estimate.outdoorSurcharge.toFixed(2)}`])
  }
  if (estimate.roofAccessFee > 0) {
    fees.push(['Roof access', `$${estimate.roofAccessFee.toFixed(2)}`])
  }

  for (const [label, value] of fees) {
    doc.text(label, margin, y)
    doc.text(value, pageW - margin, y, { align: 'right' })
    y += 5
  }

  y += 4
  doc.setDrawColor(75, 13, 28)
  doc.setLineWidth(0.4)
  doc.line(margin, y, pageW - margin, y)
  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Estimated cost', margin, y)
  doc.text(formatPaintBracket(estimate), pageW - margin, y, { align: 'right' })

  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(107, 107, 107)
  const disclaimer = doc.splitTextToSize(
    'This ballpark is an impression only based on the sizes and paint choices you entered. A painter confirms the real price on site — nothing is booked from this demo.',
    pageW - margin * 2,
  )
  doc.text(disclaimer, margin, y)

  const stamp = new Date().toISOString().slice(0, 10)
  doc.save(`GBTech-Ballpark-${estimate.setting}-${stamp}.pdf`)
}
