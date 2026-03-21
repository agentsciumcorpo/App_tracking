import { memo } from 'react'
import { formatTime } from '../../lib/utils'

interface TimerDisplayProps {
  elapsedSeconds: number
  isRunning: boolean
}

export const TimerDisplay = memo(function TimerDisplay({ elapsedSeconds, isRunning }: TimerDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`font-mono text-7xl font-bold tracking-tight ${
          isRunning ? 'text-emerald-400' : 'text-zinc-500'
        }`}
      >
        {formatTime(elapsedSeconds)}
      </span>
      {isRunning && (
        <span className="text-sm text-emerald-400/70 uppercase tracking-widest">
          En cours
        </span>
      )}
    </div>
  )
})
