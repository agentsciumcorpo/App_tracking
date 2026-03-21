import { memo } from 'react'
import { formatTime, PROJECT_COLORS } from '../../lib/utils'
import type { Project } from '../../types'

interface TimerDisplayProps {
  elapsedSeconds: number
  isRunning: boolean
  activeProject?: Project | null
}

export const TimerDisplay = memo(function TimerDisplay({ elapsedSeconds, isRunning, activeProject }: TimerDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`font-mono text-7xl font-bold tracking-tight ${
          isRunning ? 'text-emerald-400' : 'text-zinc-500'
        }`}
      >
        {formatTime(elapsedSeconds)}
      </span>
      {isRunning && activeProject && (
        <span className="flex items-center gap-2 text-sm text-zinc-300">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${PROJECT_COLORS[activeProject.color].bg}`}
          />
          {activeProject.name}
        </span>
      )}
      {isRunning && (
        <span className="text-sm text-emerald-400/70 uppercase tracking-widest">
          En cours
        </span>
      )}
    </div>
  )
})
