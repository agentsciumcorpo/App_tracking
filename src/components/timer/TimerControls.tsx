import { memo } from 'react'
import type { Project } from '../../types'
import { ProjectSelector } from '../projects/ProjectSelector'

interface TimerControlsProps {
  taskName: string
  onTaskNameChange: (name: string) => void
  projects: Project[]
  selectedProjectId: string | null
  onProjectChange: (projectId: string) => void
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  error: string | null
}

export const TimerControls = memo(function TimerControls({
  taskName,
  onTaskNameChange,
  projects,
  selectedProjectId,
  onProjectChange,
  isRunning,
  onStart,
  onStop,
  error,
}: TimerControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <input
        type="text"
        value={taskName}
        onChange={(e) => onTaskNameChange(e.target.value)}
        placeholder="Nom de la tâche..."
        disabled={isRunning}
        maxLength={200}
        className={`w-full rounded-lg border bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500 outline-none transition-colors ${
          error && !isRunning
            ? 'border-red-500 focus:border-red-400'
            : 'border-zinc-700 focus:border-emerald-500'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isRunning) onStart()
        }}
      />

      <ProjectSelector
        projects={projects}
        selectedId={selectedProjectId}
        onChange={onProjectChange}
        disabled={isRunning}
        hasError={!!error && !selectedProjectId && !isRunning}
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        onClick={isRunning ? onStop : onStart}
        className={`w-full rounded-lg px-6 py-3 text-lg font-semibold transition-colors ${
          isRunning
            ? 'bg-red-600 hover:bg-red-500 text-white'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
        }`}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  )
})
