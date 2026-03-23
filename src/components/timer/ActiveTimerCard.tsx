import { memo } from 'react'
import { formatTime, PROJECT_COLORS } from '../../lib/utils'
import type { Project } from '../../types'

interface ActiveTimerCardProps {
  taskName: string
  elapsedSeconds: number
  project: Project | null
  onStop: () => void
  stopDisabled: boolean
}

export const ActiveTimerCard = memo(function ActiveTimerCard({
  taskName,
  elapsedSeconds,
  project,
  onStop,
  stopDisabled,
}: ActiveTimerCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-zinc-100 truncate">{taskName}</span>
        {project && (
          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span
              className={`inline-block h-2 w-2 rounded-full ${PROJECT_COLORS[project.color].bg}`}
            />
            {project.name}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-lg font-semibold text-emerald-400">
          {formatTime(elapsedSeconds)}
        </span>
        <button
          onClick={onStop}
          disabled={stopDisabled}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>
    </div>
  )
})
