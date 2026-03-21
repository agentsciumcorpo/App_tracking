import { useState, useMemo } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useProjectsContext } from '../contexts/ProjectsContext'
import { ProjectFilter } from '../components/history/ProjectFilter'
import { TaskList } from '../components/history/TaskList'

export function HistoryPage() {
  const { tasks, loading: tasksLoading, updateRating, loadMore, hasMore } = useTasks()
  const { projects, loading: projectsLoading } = useProjectsContext()
  const [filterProjectId, setFilterProjectId] = useState<string | null>(null)

  const filteredTasks = useMemo(
    () => filterProjectId ? tasks.filter((t) => t.project_id === filterProjectId) : tasks,
    [tasks, filterProjectId],
  )

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 bg-zinc-900 px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-100">Historique</h1>
      <ProjectFilter
        projects={projects}
        selectedId={filterProjectId}
        onChange={setFilterProjectId}
      />
      <TaskList tasks={filteredTasks} projects={projects} onUpdateRating={updateRating} />
      {hasMore && (
        <button
          onClick={loadMore}
          className="mx-auto rounded-lg bg-zinc-800 px-6 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
        >
          Charger plus
        </button>
      )}
    </div>
  )
}
