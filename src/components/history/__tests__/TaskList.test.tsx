import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from '../TaskList'
import type { Task, Project } from '../../../types'

const mockProjects: Project[] = [
  { id: 'p1', user_id: 'u1', name: 'Projet A', color: 'blue', created_at: '2026-01-01T00:00:00Z' },
]

const mockTasks: Task[] = [
  {
    id: 't1', user_id: 'u1', task_name: 'Tâche 1', started_at: '2026-01-01T09:00:00Z',
    ended_at: '2026-01-01T10:00:00Z', duration_minutes: 60, project_id: 'p1', rating: 4,
  },
  {
    id: 't2', user_id: 'u1', task_name: 'Tâche 2', started_at: '2026-01-01T10:00:00Z',
    ended_at: '2026-01-01T11:00:00Z', duration_minutes: 60, project_id: 'p1', rating: null,
  },
]

describe('TaskList', () => {
  it('renders empty state when no tasks', () => {
    render(<TaskList tasks={[]} projects={mockProjects} onUpdateRating={vi.fn()} />)
    expect(screen.getByText('Aucune tâche')).toBeInTheDocument()
  })

  it('renders task names', () => {
    render(<TaskList tasks={mockTasks} projects={mockProjects} onUpdateRating={vi.fn()} />)
    expect(screen.getByText('Tâche 1')).toBeInTheDocument()
    expect(screen.getByText('Tâche 2')).toBeInTheDocument()
  })

  it('shows "Non noté" for tasks without rating', () => {
    render(<TaskList tasks={mockTasks} projects={mockProjects} onUpdateRating={vi.fn()} />)
    expect(screen.getByText('Non noté')).toBeInTheDocument()
  })

  it('shows star rating editor on click', async () => {
    render(<TaskList tasks={mockTasks} projects={mockProjects} onUpdateRating={vi.fn()} />)
    await userEvent.click(screen.getByText('Non noté'))
    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })

  it('calls onUpdateRating when star is clicked in edit mode', async () => {
    const onUpdateRating = vi.fn().mockResolvedValue(true)
    render(<TaskList tasks={mockTasks} projects={mockProjects} onUpdateRating={onUpdateRating} />)
    await userEvent.click(screen.getByText('Non noté'))
    await userEvent.click(screen.getByLabelText('3 étoiles'))
    expect(onUpdateRating).toHaveBeenCalledWith('t2', 3)
  })
})
