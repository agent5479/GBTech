import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export type PreviewFrame = 'phone' | 'tablet' | 'browser'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  path: string
  frame: PreviewFrame
}

export function AppPreviewOverlay({ open, onClose, title, path, frame }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const base = import.meta.env.BASE_URL.replace(/\/$/, '') || ''
  const standaloneHref = `${base}${path}${path.includes('?') ? '&' : '?'}standalone=1`

  return (
    <div className="app-preview-overlay" role="presentation" onClick={onClose}>
      <div
        className="app-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Preview ${title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="app-preview-dialog__head">
          <h2>{title}</h2>
          <button type="button" className="app-preview-close" onClick={onClose} aria-label="Close preview">
            ×
          </button>
        </header>
        <div className={`app-preview-frame app-preview-frame--${frame}`}>
          <div className="app-preview-frame__chrome">
            <span />
            <span />
            <span />
            <p>{title}</p>
          </div>
          <iframe title={`${title} app preview`} src={standaloneHref} className="app-preview-iframe" />
        </div>
        <footer className="app-preview-dialog__foot">
          <Link to={path} className="btn ghost" onClick={onClose}>
            Open showcase page
          </Link>
          <a href={standaloneHref} target="_blank" rel="noopener noreferrer" className="btn primary">
            Open app tab ↗
          </a>
        </footer>
      </div>
    </div>
  )
}
