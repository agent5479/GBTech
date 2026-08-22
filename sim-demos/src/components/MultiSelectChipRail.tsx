interface Option {
  id: string
  label: string
}

interface Props {
  label?: string
  options: Option[]
  selected: string[]
  onToggle: (id: string) => void
}

export function MultiSelectChipRail({ label, options, selected, onToggle }: Props) {
  return (
    <div className="multi-select-rail" role="group" aria-label={label ?? 'Filters'}>
      {label ? <p className="multi-select-rail__label">{label}</p> : null}
      <div className="multi-select-rail__chips">
        {options.map((opt) => {
          const on = selected.includes(opt.id)
          return (
            <button
              key={opt.id}
              type="button"
              className={`chip${on ? ' selected' : ''}`}
              aria-pressed={on}
              onClick={() => onToggle(opt.id)}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
