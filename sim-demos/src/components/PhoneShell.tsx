import type { ReactNode } from 'react'
import { useDemoPresentation } from '../context/DemoPresentation'

interface Props {
  children: ReactNode
  brand: string
  fabLabel?: string
  onFab?: () => void
  fabDisabled?: boolean
}

/**
 * Field-app frame. On mobile / embed: phone bezel.
 * Inside the desktop tablet showcase: flat panel (no nested phone chrome).
 */
export function PhoneShell({ children, brand, fabLabel, onFab, fabDisabled }: Props) {
  const { showShowcaseChrome } = useDemoPresentation()
  const flat = showShowcaseChrome

  return (
    <div className={`phone-shell-wrap${flat ? ' phone-shell-wrap--flat' : ''}`}>
      <div className={`phone-shell${flat ? ' phone-shell--flat' : ''}`}>
        {!flat ? (
          <>
            <div className="phone-notch" aria-hidden="true" />
            <div className="phone-status">
              <span>9:41</span>
              <span>{brand}</span>
            </div>
          </>
        ) : (
          <header className="phone-flat-bar">
            <p className="phone-flat-bar__brand">{brand}</p>
            <span className="phone-flat-bar__hint">Field view</span>
          </header>
        )}
        <div className="phone-body">
          {children}
          {fabLabel && onFab ? (
            <div className="phone-fab">
              <button type="button" disabled={fabDisabled} onClick={onFab}>
                {fabLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
