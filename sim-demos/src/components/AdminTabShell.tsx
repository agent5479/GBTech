import type { ReactNode } from 'react'

export interface AdminTab {
  id: string
  label: string
}

interface Props {
  tabs: AdminTab[]
  active: string
  onChange: (id: string) => void
  children: ReactNode
}

export function AdminTabShell({ tabs, active, onChange, children }: Props) {
  return (
    <div className="admin-tab-shell">
      <div className="admin-tab-shell__tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={`admin-tab-shell__tab${active === tab.id ? ' on' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="admin-tab-shell__panel" role="tabpanel">
        {children}
      </div>
    </div>
  )
}
