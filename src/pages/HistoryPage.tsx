import { useState, useMemo } from 'react'
import { useTasks } from '../hooks/useTasks'
import type { TaskFilters } from '../hooks/useTasks'
import { useProjectsContext } from '../contexts/ProjectsContext'
import { ProjectFilter } from '../components/history/ProjectFilter'
import { DateFilter } from '../components/history/DateFilter'
import type { DatePeriod } from '../components/history/DateFilter'
import { TaskList } from '../components/history/TaskList'
import { getWeekRange } from '../lib/utils'

function getDateRange(period: DatePeriod): { dateFrom?: string; dateTo?: string } {
  if (period === 'all') return {}
  const now = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  if (period === 'today') {
    const today = fmt(now)
    return { dateFrom: today, dateTo: today }
  }

  const { weekStart, weekEnd } = getWeekRange(0)
  return { dateFrom: weekStart, dateTo: weekEnd }
}

export function HistoryPage() {
  const { projects, loading: projectsLoading } = useProjectsContext()
  const [filterProjectId, setFilterProjectId] = useState<string | null>(null)
  const [datePeriod, setDatePeriod] = useState<DatePeriod>('all')

  const filters = useMemo<TaskFilters>(() => {
    const range = getDateRange(datePeriod)
    return {
      projectId: filterProjectId,
      ...range,
    }
  }, [filterProjectId, datePeriod])

  const { tasks, loading: tasksLoading, error, updateRating, updateDuration, deleteTask, loadMore, hasMore } = useTasks(filters)

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
      <div className="flex flex-wrap items-center gap-4">
        <DateFilter selected={datePeriod} onChange={setDatePeriod} />
        <ProjectFilter
          projects={projects}
          selectedId={filterProjectId}
          onChange={setFilterProjectId}
        />
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      <TaskList
        tasks={tasks}
        projects={projects}
        onUpdateRating={updateRating}
        onUpdateDuration={updateDuration}
        onDelete={deleteTask}
      />
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
