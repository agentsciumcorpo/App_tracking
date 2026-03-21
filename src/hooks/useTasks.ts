import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { logError, isValidRating } from '../lib/utils'
import type { Task } from '../types'

export interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  updateRating: (taskId: string, rating: number | null) => Promise<boolean>
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
  hasMore: boolean
}

const PAGE_SIZE = 50

function userFriendlyError(raw: string): string {
  logError('[useTasks]', raw)
  return 'Une erreur est survenue, veuillez réessayer.'
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const fetchTasks = useCallback(async (offset = 0) => {
    const { data, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .order('ended_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (fetchError) {
      setError(userFriendlyError(fetchError.message))
      return
    }

    const rows = (data ?? []) as Task[]
    setHasMore(rows.length === PAGE_SIZE)

    if (offset === 0) {
      setTasks(rows)
    } else {
      setTasks((prev) => [...prev, ...rows])
    }
  }, [])

  useEffect(() => {
    fetchTasks().finally(() => setLoading(false))
  }, [fetchTasks])

  const loadMore = useCallback(async () => {
    await fetchTasks(tasks.length)
  }, [fetchTasks, tasks.length])

  const refresh = useCallback(async () => {
    setLoading(true)
    await fetchTasks()
    setLoading(false)
  }, [fetchTasks])

  const updateRating = useCallback(async (taskId: string, rating: number | null): Promise<boolean> => {
    if (!isValidRating(rating)) {
      setError('Note invalide (1-5)')
      return false
    }

    setError(null)
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, rating } : t)))

    const { error: updateError } = await supabase
      .from('tasks')
      .update({ rating })
      .eq('id', taskId)

    if (updateError) {
      setError(userFriendlyError(updateError.message))
      await fetchTasks()
      return false
    }

    return true
  }, [fetchTasks])

  return { tasks, loading, error, updateRating, refresh, loadMore, hasMore }
}
