import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateFilter } from '../DateFilter'

describe('DateFilter', () => {
  it('renders all period buttons', () => {
    render(<DateFilter selected="all" onChange={vi.fn()} />)
    expect(screen.getByText('Tout')).toBeInTheDocument()
    expect(screen.getByText("Aujourd'hui")).toBeInTheDocument()
    expect(screen.getByText('Cette semaine')).toBeInTheDocument()
  })

  it('highlights the selected period', () => {
    render(<DateFilter selected="today" onChange={vi.fn()} />)
    expect(screen.getByText("Aujourd'hui").className).toContain('bg-emerald-600')
    expect(screen.getByText('Tout').className).toContain('bg-zinc-800')
  })

  it('calls onChange with correct period', async () => {
    const onChange = vi.fn()
    render(<DateFilter selected="all" onChange={onChange} />)
    await userEvent.click(screen.getByText('Cette semaine'))
    expect(onChange).toHaveBeenCalledWith('week')
  })
})
