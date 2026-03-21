import { useTimer } from '../hooks/useTimer'
import { useProjectsContext } from '../contexts/ProjectsContext'
import { TimerDisplay } from '../components/timer/TimerDisplay'
import { TimerControls } from '../components/timer/TimerControls'
import { RatingModal } from '../components/ui/RatingModal'

export function TimerPage() {
  const {
    taskName,
    setTaskName,
    projectId,
    setProjectId,
    isRunning,
    elapsedSeconds,
    startTimer,
    stopTimer,
    pendingStop,
    confirmStop,
    error,
    loading,
  } = useTimer()

  const { projects, loading: projectsLoading } = useProjectsContext()

  const activeProject = projects.find((p) => p.id === projectId) ?? null

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
      <TimerDisplay elapsedSeconds={elapsedSeconds} isRunning={isRunning} activeProject={activeProject} />
      <TimerControls
        taskName={taskName}
        onTaskNameChange={setTaskName}
        projects={projects}
        selectedProjectId={projectId}
        onProjectChange={setProjectId}
        isRunning={isRunning}
        onStart={startTimer}
        onStop={stopTimer}
        error={error}
      />
      {pendingStop && <RatingModal onSubmit={confirmStop} />}
    </div>
  )
}
