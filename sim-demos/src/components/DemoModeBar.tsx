import { Link, useLocation } from 'react-router-dom'
import { useDemoPresentation } from '../context/DemoPresentation'
import { ShowcaseChrome } from './ShowcaseShell'

interface Props {
  clientTo: string
  clientLabel: string
  opsTo: string
  opsLabel: string
  /** Optional peak-season data toggle (Studio Flow showcase). */
  peakOn?: boolean
  onPeakToggle?: (on: boolean) => void
}

/** Discreet demo-mode strip: Client ↔ Ops perspective + optional peak data. */
export function DemoModeBar({
  clientTo,
  clientLabel,
  opsTo,
  opsLabel,
  peakOn,
  onPeakToggle,
}: Props) {
  const { showShowcaseChrome } = useDemoPresentation()
  const { pathname } = useLocation()
  if (!showShowcaseChrome) return null

  const onClient = pathname === clientTo || pathname.startsWith(`${clientTo}/`)
  const onOps = pathname === opsTo || pathname.startsWith(`${opsTo}/`)

  return (
    <ShowcaseChrome>
      <aside className="demo-mode-bar" aria-label="Demo mode">
        <span className="demo-mode-bar__label">Demo mode</span>
        <div className="demo-mode-bar__views">
          <Link to={clientTo} className={onClient ? 'on' : undefined}>
            {clientLabel}
          </Link>
          <Link to={opsTo} className={onOps ? 'on' : undefined}>
            {opsLabel}
          </Link>
          {onPeakToggle ? (
            <button
              type="button"
              className={peakOn ? 'on' : undefined}
              onClick={() => onPeakToggle(!peakOn)}
              aria-pressed={Boolean(peakOn)}
            >
              {peakOn ? 'Peak day data' : 'Normal day data'}
            </button>
          ) : null}
        </div>
      </aside>
    </ShowcaseChrome>
  )
}
