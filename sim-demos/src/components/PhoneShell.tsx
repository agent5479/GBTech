import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  brand: string
}

export function PhoneShell({ children, brand }: Props) {
  return (
    <div className="phone-shell-wrap">
      <div className="phone-shell">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-status">
          <span>9:41</span>
          <span>{brand}</span>
        </div>
        <div className="phone-body">{children}</div>
      </div>
    </div>
  )
}
