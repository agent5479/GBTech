import { useState } from 'react'
import { copyBallparkText } from '../shared/ballparkText'
import type { PaintEstimate } from '../shared/paintingQuote'

export function BallparkExportActions({ estimate }: { estimate: PaintEstimate }) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  function flash(message: string) {
    setStatus(message)
    window.setTimeout(() => setStatus(''), 2500)
  }

  async function onCopy() {
    setBusy(true)
    try {
      const ok = await copyBallparkText(estimate)
      flash(ok ? 'Copied to clipboard' : 'Could not copy — try download instead')
    } finally {
      setBusy(false)
    }
  }

  async function onDownload() {
    setBusy(true)
    try {
      const { exportBallparkPdf } = await import('../shared/ballparkExport')
      await exportBallparkPdf(estimate)
      flash('PDF downloaded')
    } catch {
      flash('Download failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ballpark-export">
      <div className="btn-row">
        <button type="button" className="btn ghost" disabled={busy} onClick={() => void onCopy()}>
          Copy estimate
        </button>
        <button type="button" className="btn primary" disabled={busy} onClick={() => void onDownload()}>
          {busy ? 'Working…' : 'Download PDF'}
        </button>
      </div>
      {status ? <p className="ballpark-export-status">{status}</p> : null}
    </div>
  )
}
