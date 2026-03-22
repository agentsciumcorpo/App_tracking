import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeekSelector } from '../WeekSelector'

const options = [
  { label: 'Cette semaine', weekStart: '2026-03-16', weekEnd: '2026-03-22' },
  { label: 'Semaine dernière', weekStart: '2026-03-09', weekEnd: '2026-03-15' },
]

describe('WeekSelector', () => {
  it('renders all options', () => {
    render(<WeekSelector options={options} selectedIndex={0} onChange={vi.fn()} />)
    expect(screen.getByText('Cette semaine')).toBeInTheDocument()
    expect(screen.getByText('Semaine dernière')).toBeInTheDocument()
  })

  it('highlights selected option', () => {
    render(<WeekSelector options={options} selectedIndex={0} onChange={vi.fn()} />)
    expect(screen.getByText('Cette semaine').className).toContain('bg-emerald-600')
    expect(screen.getByText('Semaine dernière').className).toContain('bg-zinc-800')
  })

  it('calls onChange with correct index', async () => {
    const onChange = vi.fn()
    render(<WeekSelector options={options} selectedIndex={0} onChange={onChange} />)
    await userEvent.click(screen.getByText('Semaine dernière'))
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
