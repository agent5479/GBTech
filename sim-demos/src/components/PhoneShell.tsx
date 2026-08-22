import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  brand: string
  fabLabel?: string
  onFab?: () => void
  fabDisabled?: boolean
}

export function PhoneShell({ children, brand, fabLabel, onFab, fabDisabled }: Props) {
  return (
    <div className="phone-shell-wrap">
      <div className="phone-shell">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-status">
          <span>9:41</span>
          <span>{brand}</span>
        </div>
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
