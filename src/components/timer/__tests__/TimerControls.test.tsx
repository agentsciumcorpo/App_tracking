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
  isRunning: false,
  onStart: vi.fn(),
  onStop: vi.fn(),
  error: null,
}

describe('TimerControls', () => {
  it('renders Start button when not running', () => {
    render(<TimerControls {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('renders Stop button when running', () => {
    render(<TimerControls {...defaultProps} isRunning={true} />)
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('disables input when running', () => {
    render(<TimerControls {...defaultProps} isRunning={true} />)
    expect(screen.getByPlaceholderText('Nom de la tâche...')).toBeDisabled()
  })

  it('enables input when not running', () => {
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

  it('does not call onStart on Enter when running', async () => {
    const onStart = vi.fn()
    render(<TimerControls {...defaultProps} onStart={onStart} isRunning={true} />)
    const input = screen.getByPlaceholderText('Nom de la tâche...')
    await userEvent.click(input)
    await userEvent.keyboard('{Enter}')
    expect(onStart).not.toHaveBeenCalled()
  })

  it('displays error message', () => {
    render(<TimerControls {...defaultProps} error="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('calls onStop when Stop button is clicked', async () => {
    const onStop = vi.fn()
    render(<TimerControls {...defaultProps} isRunning={true} onStop={onStop} />)
    await userEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(onStop).toHaveBeenCalledOnce()
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

  it('disables project selector when running', () => {
    render(<TimerControls {...defaultProps} isRunning={true} selectedProjectId="p1" />)
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })
})
