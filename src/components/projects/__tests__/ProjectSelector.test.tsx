import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectSelector } from '../ProjectSelector'
import type { Project } from '../../../types'

const mockProjects: Project[] = [
  { id: 'p1', user_id: 'u1', name: 'Projet A', color: 'blue', created_at: '2026-01-01T00:00:00Z' },
  { id: 'p2', user_id: 'u1', name: 'Projet B', color: 'red', created_at: '2026-01-02T00:00:00Z' },
]

describe('ProjectSelector', () => {
  it('renders placeholder when no project selected', () => {
    render(<ProjectSelector projects={mockProjects} selectedId={null} onChange={vi.fn()} />)
    expect(screen.getByText('Sélectionner un projet...')).toBeInTheDocument()
  })

  it('displays all projects as options', () => {
    render(<ProjectSelector projects={mockProjects} selectedId={null} onChange={vi.fn()} />)
    expect(screen.getByText('Projet A')).toBeInTheDocument()
    expect(screen.getByText('Projet B')).toBeInTheDocument()
  })

  it('calls onChange when a project is selected', async () => {
    const onChange = vi.fn()
    render(<ProjectSelector projects={mockProjects} selectedId={null} onChange={onChange} />)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'p1')
    expect(onChange).toHaveBeenCalledWith('p1')
  })

  it('disables select when disabled prop is true', () => {
    render(<ProjectSelector projects={mockProjects} selectedId="p1" onChange={vi.fn()} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})
