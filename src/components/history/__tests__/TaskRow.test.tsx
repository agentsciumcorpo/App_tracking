import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskRow } from '../TaskRow'
import type { Task, Project } from '../../../types'

const mockProject: Project = {
  id: 'p1', user_id: 'u1', name: 'Projet A', color: 'blue', created_at: '2026-01-01T00:00:00Z',
}

const mockTask: Task = {
  id: 't1', user_id: 'u1', task_name: 'Ma tâche', started_at: '2026-03-21T09:00:00Z',
  ended_at: '2026-03-21T10:30:00Z', duration_minutes: 90, project_id: 'p1', rating: 3,
}

const defaultProps = {
  task: mockTask,
  project: mockProject,
  onUpdateRating: vi.fn().mockResolvedValue(true),
  onUpdateDuration: vi.fn().mockResolvedValue(true),
  onDelete: vi.fn().mockResolvedValue(true),
}

describe('TaskRow', () => {
  it('displays task name', () => {
    render(<TaskRow {...defaultProps} />)
    expect(screen.getByText('Ma tâche')).toBeInTheDocument()
  })

  it('displays project name', () => {
    render(<TaskRow {...defaultProps} />)
    expect(screen.getByText('Projet A')).toBeInTheDocument()
  })

  it('displays formatted date', () => {
    render(<TaskRow {...defaultProps} />)
    expect(screen.getByText(/21\/03\/2026/)).toBeInTheDocument()
  })

  it('displays formatted duration', () => {
    render(<TaskRow {...defaultProps} />)
    expect(screen.getByText('01:30:00')).toBeInTheDocument()
  })

  it('opens duration editor on click', async () => {
    render(<TaskRow {...defaultProps} />)
    await userEvent.click(screen.getByText('01:30:00'))
    expect(screen.getByRole('spinbutton')).toHaveValue(90)
  })

  it('submits new duration on Enter', async () => {
    const onUpdateDuration = vi.fn().mockResolvedValue(true)
    render(<TaskRow {...defaultProps} onUpdateDuration={onUpdateDuration} />)
    await userEvent.click(screen.getByText('01:30:00'))
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '120')
    await userEvent.keyboard('{Enter}')
    expect(onUpdateDuration).toHaveBeenCalledWith('t1', 120)
  })

  it('calls onDelete with confirmation', async () => {
    const onDelete = vi.fn().mockResolvedValue(true)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<TaskRow {...defaultProps} onDelete={onDelete} />)
    await userEvent.click(screen.getByTitle('Supprimer'))
    expect(onDelete).toHaveBeenCalledWith('t1')
    vi.restoreAllMocks()
  })

  it('does not delete when confirmation is cancelled', async () => {
    const onDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<TaskRow {...defaultProps} onDelete={onDelete} />)
    await userEvent.click(screen.getByTitle('Supprimer'))
    expect(onDelete).not.toHaveBeenCalled()
    vi.restoreAllMocks()
  })
})
