import { memo } from 'react'
import { ActiveTimerCard } from './ActiveTimerCard'
import type { TimerEntry } from '../../hooks/useTimers'
import type { Project } from '../../types'

interface ActiveTimersListProps {
  timers: TimerEntry[]
  projects: Project[]
  onStop: (timerId: string) => void
  hasPendingStop: boolean
}

export const ActiveTimersList = memo(function ActiveTimersList({
  timers,
  projects,
  onStop,
  hasPendingStop,
}: ActiveTimersListProps) {
  if (timers.length === 0) return null

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Timers actifs ({timers.length})
      </h2>
      {timers.map((timer) => (
        <ActiveTimerCard
          key={timer.id}
          taskName={timer.taskName}
          elapsedSeconds={timer.elapsedSeconds}
          project={projects.find((p) => p.id === timer.projectId) ?? null}
          onStop={() => onStop(timer.id)}
          stopDisabled={hasPendingStop}
        />
      ))}
    </div>
  )
})
