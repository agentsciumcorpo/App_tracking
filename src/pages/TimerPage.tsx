import { useTimers } from '../hooks/useTimers'
import { useProjectsContext } from '../contexts/ProjectsContext'
import { TimerControls } from '../components/timer/TimerControls'
import { ActiveTimersList } from '../components/timer/ActiveTimersList'
import { RatingModal } from '../components/ui/RatingModal'

export function TimerPage() {
  const {
    timers,
    taskName,
    setTaskName,
    projectId,
    setProjectId,
    startTimer,
    stopTimer,
    confirmStop,
    cancelStop,
    error,
    loading,
    hasPendingStop,
  } = useTimers()

  const { projects, loading: projectsLoading } = useProjectsContext()

  const pendingTimer = timers.find((t) => t.pendingStop)

  if (loading || projectsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-zinc-900 px-4">
      <h1 className="text-3xl font-bold text-zinc-100">Timer</h1>
      <TimerControls
        taskName={taskName}
        onTaskNameChange={setTaskName}
        projects={projects}
        selectedProjectId={projectId}
        onProjectChange={setProjectId}
        onStart={startTimer}
        error={error}
      />
      <ActiveTimersList
        timers={timers.filter((t) => !t.pendingStop)}
        projects={projects}
        onStop={stopTimer}
        hasPendingStop={hasPendingStop}
      />
      {pendingTimer && (
        <RatingModal
          onSubmit={(rating) => confirmStop(pendingTimer.id, rating)}
          onCancel={() => cancelStop(pendingTimer.id)}
          taskName={pendingTimer.taskName}
        />
      )}
    </div>
  )
}
