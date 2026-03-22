import { memo } from 'react'
import { ToggleGroup } from '../ui/ToggleGroup'

export type DatePeriod = 'today' | 'week' | 'all'

interface DateFilterProps {
  selected: DatePeriod
  onChange: (period: DatePeriod) => void
}

const OPTIONS: { value: DatePeriod; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: 'Cette semaine' },
]

export const DateFilter = memo(function DateFilter({ selected, onChange }: DateFilterProps) {
  return <ToggleGroup options={OPTIONS} selected={selected} onChange={onChange} />
})
