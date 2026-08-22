interface StaffOption {
  id: string
  name: string
  role?: string
}

interface Props {
  staff: StaffOption[]
  primaryId: string
  assistantId?: string
  onPrimaryChange: (id: string) => void
  onAssistantChange?: (id: string) => void
  compact?: boolean
}

export function StaffRoleAllocator({
  staff,
  primaryId,
  assistantId,
  onPrimaryChange,
  onAssistantChange,
  compact,
}: Props) {
  const primary = staff.find((s) => s.id === primaryId)
  return (
    <div className={`staff-role-row${compact ? ' staff-role-row--compact' : ''}`}>
      <select value={primaryId} aria-label="Lead assignee" onChange={(e) => onPrimaryChange(e.target.value)}>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      {primary?.role ? <span className="staff-role-badge">{primary.role}</span> : null}
      {onAssistantChange ? (
        <select
          value={assistantId ?? ''}
          aria-label="Relief assignee"
          onChange={(e) => onAssistantChange(e.target.value || '')}
        >
          <option value="">No relief</option>
          {staff
            .filter((s) => s.id !== primaryId)
            .map((s) => (
              <option key={s.id} value={s.id}>
                + {s.name}
              </option>
            ))}
        </select>
      ) : null}
    </div>
  )
}
