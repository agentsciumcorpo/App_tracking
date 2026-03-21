import { memo, useState, useMemo } from 'react'
import type { Task, Project } from '../../types'
import { formatTime, PROJECT_COLORS } from '../../lib/utils'
import { StarRating } from '../ui/StarRating'

interface TaskListProps {
  tasks: Task[]
  projects: Project[]
  onUpdateRating: (taskId: string, rating: number | null) => Promise<boolean>
}

export const TaskList = memo(function TaskList({ tasks, projects, onUpdateRating }: TaskListProps) {
  const projectMap = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects])
  const [editingId, setEditingId] = useState<string | null>(null)

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-zinc-500">
        <p className="text-lg">Aucune tâche</p>
        <p className="text-sm">Les tâches complétées apparaîtront ici.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => {
        const project = projectMap.get(task.project_id)
        const isEditing = editingId === task.id
        return (
          <li
            key={task.id}
            className="flex items-center justify-between rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-3"
          >
            <div className="flex flex-col gap-1">
              <span className="text-zinc-100">{task.task_name}</span>
              {project && (
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className={`inline-block h-2 w-2 rounded-full ${PROJECT_COLORS[project.color].bg}`} />
                  {project.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {isEditing ? (
                <StarRating
                  value={task.rating}
                  onChange={async (r) => {
                    await onUpdateRating(task.id, r)
                    setEditingId(null)
                  }}
                  size="sm"
                />
              ) : (
                <button
                  onClick={() => setEditingId(task.id)}
                  className="transition-opacity hover:opacity-80"
                >
                  {task.rating ? (
                    <StarRating value={task.rating} readOnly size="sm" />
                  ) : (
                    <span className="text-xs text-zinc-600">Non noté</span>
                  )}
                </button>
              )}
              <span className="font-mono text-sm text-zinc-400">
                {formatTime(task.duration_minutes * 60)}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
})
