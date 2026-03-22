import { memo, useMemo } from 'react'
import { ToggleGroup } from '../ui/ToggleGroup'

interface WeekOption {
  label: string
  weekStart: string
  weekEnd: string
}

interface WeekSelectorProps {
  options: WeekOption[]
  selectedIndex: number
  onChange: (index: number) => void
}

export const WeekSelector = memo(function WeekSelector({
  options,
  selectedIndex,
  onChange,
}: WeekSelectorProps) {
  const toggleOptions = useMemo(
    () => options.map((opt, i) => ({ value: i, label: opt.label })),
    [options],
  )

  return <ToggleGroup options={toggleOptions} selected={selectedIndex} onChange={onChange} />
})
