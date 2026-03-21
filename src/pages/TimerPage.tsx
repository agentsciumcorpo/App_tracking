import { useTimer } from '../hooks/useTimer'
import { TimerDisplay } from '../components/timer/TimerDisplay'
import { TimerControls } from '../components/timer/TimerControls'

export function TimerPage() {
  const {
    taskName,
    setTaskName,
    isRunning,
    elapsedSeconds,
    startTimer,
    stopTimer,
    error,
    loading,
  } = useTimer()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-zinc-900 px-4">
      <h1 className="text-3xl font-bold text-zinc-100">Timer</h1>
      <TimerDisplay elapsedSeconds={elapsedSeconds} isRunning={isRunning} />
      <TimerControls
        taskName={taskName}
        onTaskNameChange={setTaskName}
        isRunning={isRunning}
        onStart={startTimer}
        onStop={stopTimer}
        error={error}
      />
    </div>
  )
}
