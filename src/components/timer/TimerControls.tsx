import { memo } from 'react'
import type { Project } from '../../types'
import { ProjectSelector } from '../projects/ProjectSelector'

interface TimerControlsProps {
  taskName: string
  onTaskNameChange: (name: string) => void
  projects: Project[]
  selectedProjectId: string | null
  onProjectChange: (projectId: string) => void
  onStart: () => void
  error: string | null
}

export const TimerControls = memo(function TimerControls({
  taskName,
  onTaskNameChange,
  projects,
  selectedProjectId,
  onProjectChange,
  onStart,
  error,
}: TimerControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <input
        type="text"
        value={taskName}
        onChange={(e) => onTaskNameChange(e.target.value)}
        placeholder="Nom de la tâche..."
        maxLength={200}
        className={`w-full rounded-lg border bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-400'
            : 'border-zinc-700 focus:border-emerald-500'
        }`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onStart()
        }}
      />

      <ProjectSelector
        projects={projects}
        selectedId={selectedProjectId}
        onChange={onProjectChange}
        disabled={false}
        hasError={!!error && !selectedProjectId}
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        onClick={onStart}
        className="w-full rounded-lg px-6 py-3 text-lg font-semibold transition-colors bg-emerald-600 hover:bg-emerald-500 text-white"
      >
        Start
      </button>
    </div>
  )
})
