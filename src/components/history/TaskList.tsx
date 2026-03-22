import { memo, useMemo } from 'react'
import type { Task, Project } from '../../types'
import { TaskRow } from './TaskRow'

interface TaskListProps {
  tasks: Task[]
  projects: Project[]
  onUpdateRating: (taskId: string, rating: number | null) => Promise<boolean>
  onUpdateDuration: (taskId: string, minutes: number) => Promise<boolean>
  onDelete: (taskId: string) => Promise<boolean>
}

export const TaskList = memo(function TaskList({
  tasks,
  projects,
  onUpdateRating,
  onUpdateDuration,
  onDelete,
}: TaskListProps) {
  const projectMap = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects])

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
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          project={projectMap.get(task.project_id)}
          onUpdateRating={onUpdateRating}
          onUpdateDuration={onUpdateDuration}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
})
