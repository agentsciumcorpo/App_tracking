import { memo, useState, useCallback } from 'react'
import type { Task, Project } from '../../types'
import { formatTime, formatDate, PROJECT_COLORS } from '../../lib/utils'
import { StarRating } from '../ui/StarRating'

interface TaskRowProps {
  task: Task
  project: Project | undefined
  onUpdateRating: (taskId: string, rating: number | null) => Promise<boolean>
  onUpdateDuration: (taskId: string, minutes: number) => Promise<boolean>
  onDelete: (taskId: string) => Promise<boolean>
}

export const TaskRow = memo(function TaskRow({
  task,
  project,
  onUpdateRating,
  onUpdateDuration,
  onDelete,
}: TaskRowProps) {
  const [editingRating, setEditingRating] = useState(false)
  const [editingDuration, setEditingDuration] = useState(false)
  const [durationInput, setDurationInput] = useState('')

  const handleRatingChange = useCallback(async (r: number) => {
    await onUpdateRating(task.id, r)
    setEditingRating(false)
  }, [task.id, onUpdateRating])

  const handleDurationStart = useCallback(() => {
    setDurationInput(String(task.duration_minutes))
    setEditingDuration(true)
  }, [task.duration_minutes])

  const handleDurationSubmit = useCallback(async () => {
    const parsed = parseInt(durationInput, 10)
    if (isNaN(parsed) || parsed < 0 || parsed > 9999) {
      setEditingDuration(false)
      return
    }
    await onUpdateDuration(task.id, parsed)
    setEditingDuration(false)
  }, [task.id, durationInput, onUpdateDuration])

  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Supprimer la tâche "${task.task_name}" ?`)) return
    await onDelete(task.id)
  }, [task.id, task.task_name, onDelete])

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-3">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-zinc-100 truncate">{task.task_name}</span>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          {project && (
            <span className="flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${PROJECT_COLORS[project.color].bg}`} />
              {project.name}
            </span>
          )}
          <span>{formatDate(task.ended_at)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {editingRating ? (
          <StarRating value={task.rating} onChange={handleRatingChange} size="sm" />
        ) : (
          <button onClick={() => setEditingRating(true)} className="transition-opacity hover:opacity-80">
            {task.rating ? (
              <StarRating value={task.rating} readOnly size="sm" />
            ) : (
              <span className="text-xs text-zinc-600">Non noté</span>
            )}
          </button>
        )}

        {editingDuration ? (
          <input
            type="number"
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            onBlur={handleDurationSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleDurationSubmit() }}
            min={0}
            max={9999}
            autoFocus
            className="w-16 rounded border border-zinc-600 bg-zinc-700 px-2 py-0.5 text-center font-mono text-sm text-zinc-100 outline-none focus:border-emerald-500"
          />
        ) : (
          <button
            onClick={handleDurationStart}
            className="font-mono text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            title="Modifier la durée"
          >
            {formatTime(task.duration_minutes * 60)}
          </button>
        )}

        <button
          onClick={handleDelete}
          className="text-zinc-600 transition-colors hover:text-red-400"
          title="Supprimer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
          </svg>
        </button>
      </div>
    </li>
  )
})
