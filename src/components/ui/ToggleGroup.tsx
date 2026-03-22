import { memo } from 'react'

interface ToggleGroupProps<T extends string | number> {
  options: { value: T; label: string }[]
  selected: T
  onChange: (value: T) => void
}

function ToggleGroupInner<T extends string | number>({
  options,
  selected,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            selected === opt.value
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export const ToggleGroup = memo(ToggleGroupInner) as typeof ToggleGroupInner
