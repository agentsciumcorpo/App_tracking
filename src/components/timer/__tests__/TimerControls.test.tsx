import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerControls } from '../TimerControls'
import type { Project } from '../../../types'

const mockProjects: Project[] = [
  { id: 'p1', user_id: 'u1', name: 'Projet A', color: 'blue', created_at: '2026-01-01T00:00:00Z' },
  { id: 'p2', user_id: 'u1', name: 'Projet B', color: 'red', created_at: '2026-01-02T00:00:00Z' },
]

const defaultProps = {
  taskName: '',
  onTaskNameChange: vi.fn(),
  projects: mockProjects,
  selectedProjectId: null as string | null,
  onProjectChange: vi.fn(),
  onStart: vi.fn(),
  error: null,
}

describe('TimerControls', () => {
  it('renders Start button', () => {
    render(<TimerControls {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('input is always enabled', () => {
    render(<TimerControls {...defaultProps} />)
    expect(screen.getByPlaceholderText('Nom de la tâche...')).toBeEnabled()
  })

  it('calls onStart when Enter is pressed', async () => {
    const onStart = vi.fn()
    render(<TimerControls {...defaultProps} onStart={onStart} taskName="test" />)
    const input = screen.getByPlaceholderText('Nom de la tâche...')
    await userEvent.click(input)
    await userEvent.keyboard('{Enter}')
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('displays error message', () => {
    render(<TimerControls {...defaultProps} error="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('has maxLength attribute on input', () => {
    render(<TimerControls {...defaultProps} />)
    expect(screen.getByPlaceholderText('Nom de la tâche...')).toHaveAttribute('maxlength', '200')
  })

  it('renders project selector', () => {
    render(<TimerControls {...defaultProps} />)
    expect(screen.getByText('Sélectionner un projet...')).toBeInTheDocument()
  })

  it('shows project options', () => {
    render(<TimerControls {...defaultProps} />)
    expect(screen.getByText('Projet A')).toBeInTheDocument()
    expect(screen.getByText('Projet B')).toBeInTheDocument()
  })

  it('project selector is always enabled', () => {
    render(<TimerControls {...defaultProps} selectedProjectId="p1" />)
    const select = screen.getByRole('combobox')
    expect(select).toBeEnabled()
  })
})
