import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { mapSupabaseError } from '../lib/errors'
import { isValidRating } from '../lib/utils'
import type { Task } from '../types'

export interface TaskFilters {
  projectId?: string | null
  dateFrom?: string
  dateTo?: string
}

export interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  updateRating: (taskId: string, rating: number | null) => Promise<boolean>
  updateDuration: (taskId: string, minutes: number) => Promise<boolean>
  deleteTask: (taskId: string) => Promise<boolean>
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
  hasMore: boolean
}

const PAGE_SIZE = 50

export function useTasks(filters?: TaskFilters): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const userIdRef = useRef<string | null>(null)
  const tasksLengthRef = useRef(0)
  tasksLengthRef.current = tasks.length

  const fetchTasks = useCallback(async (offset = 0) => {
    setError(null)
    let query = supabase
      .from('tasks')
      .select('*')
      .order('ended_at', { ascending: false })

    if (filters?.projectId) {
      query = query.eq('project_id', filters.projectId)
    }
    if (filters?.dateFrom) {
      query = query.gte('ended_at', `${filters.dateFrom}T00:00:00Z`)
    }
    if (filters?.dateTo) {
      query = query.lte('ended_at', `${filters.dateTo}T23:59:59Z`)
    }

    query = query.range(offset, offset + PAGE_SIZE - 1)

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(mapSupabaseError('useTasks', fetchError.message))
      return
    }

    const rows = (data ?? []) as Task[]
    setHasMore(rows.length === PAGE_SIZE)

    if (offset === 0) {
      setTasks(rows)
    } else {
      setTasks((prev) => [...prev, ...rows])
    }
  }, [filters?.projectId, filters?.dateFrom, filters?.dateTo])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) userIdRef.current = user.id
      await fetchTasks()
      setLoading(false)
    }
    init()
  }, [fetchTasks])

  const loadMore = useCallback(async () => {
    await fetchTasks(tasksLengthRef.current)
  }, [fetchTasks])

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

    let query = supabase.from('tasks').update({ rating }).eq('id', taskId)
    if (userIdRef.current) query = query.eq('user_id', userIdRef.current)

    const { error: updateError } = await query

    if (updateError) {
      setError(mapSupabaseError('useTasks', updateError.message))
      await fetchTasks()
      return false
    }

    return true
  }, [fetchTasks])

  const updateDuration = useCallback(async (taskId: string, minutes: number): Promise<boolean> => {
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 9999) {
      setError('Durée invalide (0-9999 minutes)')
      return false
    }

    setError(null)
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, duration_minutes: minutes } : t)))

    let query = supabase.from('tasks').update({ duration_minutes: minutes }).eq('id', taskId)
    if (userIdRef.current) query = query.eq('user_id', userIdRef.current)

    const { error: updateError } = await query

    if (updateError) {
      setError(mapSupabaseError('useTasks', updateError.message))
      await fetchTasks()
      return false
    }

    return true
  }, [fetchTasks])

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    setError(null)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    let query = supabase.from('tasks').delete().eq('id', taskId)
    if (userIdRef.current) query = query.eq('user_id', userIdRef.current)

    const { error: deleteError } = await query

    if (deleteError) {
      setError(mapSupabaseError('useTasks', deleteError.message))
      await fetchTasks()
      return false
    }

    return true
  }, [fetchTasks])

  return { tasks, loading, error, updateRating, updateDuration, deleteTask, refresh, loadMore, hasMore }
}
