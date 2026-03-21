import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectFilter } from '../ProjectFilter'
import type { Project } from '../../../types'

const mockProjects: Project[] = [
  { id: 'p1', user_id: 'u1', name: 'Projet A', color: 'blue', created_at: '2026-01-01T00:00:00Z' },
  { id: 'p2', user_id: 'u1', name: 'Projet B', color: 'red', created_at: '2026-01-02T00:00:00Z' },
]

describe('ProjectFilter', () => {
  it('renders "Tous" button and all projects', () => {
    render(<ProjectFilter projects={mockProjects} selectedId={null} onChange={vi.fn()} />)
    expect(screen.getByText('Tous')).toBeInTheDocument()
    expect(screen.getByText('Projet A')).toBeInTheDocument()
    expect(screen.getByText('Projet B')).toBeInTheDocument()
  })

  it('calls onChange with project id when project clicked', async () => {
    const onChange = vi.fn()
    render(<ProjectFilter projects={mockProjects} selectedId={null} onChange={onChange} />)
    await userEvent.click(screen.getByText('Projet A'))
    expect(onChange).toHaveBeenCalledWith('p1')
  })

  it('calls onChange with null when "Tous" clicked', async () => {
    const onChange = vi.fn()
    render(<ProjectFilter projects={mockProjects} selectedId="p1" onChange={onChange} />)
    await userEvent.click(screen.getByText('Tous'))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('highlights selected project', () => {
    render(<ProjectFilter projects={mockProjects} selectedId="p1" onChange={vi.fn()} />)
    const button = screen.getByText('Projet A').closest('button')
    expect(button?.className).toContain('bg-zinc-700')
  })

  it('highlights "Tous" when no filter selected', () => {
    render(<ProjectFilter projects={mockProjects} selectedId={null} onChange={vi.fn()} />)
    const button = screen.getByText('Tous')
    expect(button.className).toContain('bg-emerald-600')
  })
})
