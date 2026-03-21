import { memo } from 'react'
import type { ProjectColor } from '../../types'
import { PROJECT_COLORS, PROJECT_COLOR_LIST } from '../../lib/utils'

interface ColorPickerProps {
  selected: ProjectColor
  onChange: (color: ProjectColor) => void
}

export const ColorPicker = memo(function ColorPicker({ selected, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROJECT_COLOR_LIST.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`h-8 w-8 rounded-full transition-all ${PROJECT_COLORS[color].bg} ${
            selected === color
              ? 'ring-2 ring-offset-2 ring-offset-zinc-800 ' + PROJECT_COLORS[color].ring + ' scale-110'
              : 'opacity-60 hover:opacity-100'
          }`}
          aria-label={color}
        />
      ))}
    </div>
  )
})
