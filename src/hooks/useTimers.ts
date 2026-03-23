import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { logError } from '../lib/utils'
import type { ActiveTimer } from '../types'

export interface TimerEntry {
  id: string
  taskName: string
  projectId: string
  startedAt: Date
  elapsedSeconds: number
  pendingStop: boolean
  stoppedAt: Date | null
}

export interface UseTimersReturn {
  timers: TimerEntry[]
  taskName: string
  setTaskName: (name: string) => void
  projectId: string | null
  setProjectId: (id: string) => void
  startTimer: () => Promise<void>
  stopTimer: (timerId: string) => void
  confirmStop: (timerId: string, rating?: number | null) => Promise<void>
  cancelStop: (timerId: string) => void
  error: string | null
  loading: boolean
  hasPendingStop: boolean
}

const MAX_TASK_NAME_LENGTH = 200

function userFriendlyError(raw: string): string {
  logError('[useTimers]', raw)
  return 'Une erreur est survenue, veuillez réessayer.'
}

function isValidRating(rating: number | null): boolean {
  return rating === null || (Number.isInteger(rating) && rating >= 1 && rating <= 5)
}

function computeElapsed(startedAt: Date): number {
  return Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000))
}

export function useTimers(): UseTimersReturn {
  const [taskName, setTaskName] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [timers, setTimers] = useState<TimerEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const userIdRef = useRef<string | null>(null)
  const pendingRef = useRef(false)

  const hasPendingStop = timers.some((t) => t.pendingStop)

  // --- Single shared interval to update all timers ---
  const startInterval = useCallback(() => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) =>
          t.pendingStop
            ? t
            : { ...t, elapsedSeconds: computeElapsed(t.startedAt) }
        )
      )
    }, 1000)
  }, [])

  const stopIntervalIfEmpty = useCallback((timersList: TimerEntry[]) => {
    const activeCount = timersList.filter((t) => !t.pendingStop).length
    if (activeCount === 0 && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // --- Restore all active timers on mount ---
  useEffect(() => {
    let cancelled = false

    async function restore() {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        setLoading(false)
        return
      }

      userIdRef.current = user.id

      const { data, error: fetchError } = await supabase
        .from('active_timers')
        .select('*')
        .returns<ActiveTimer[]>()

      if (cancelled) return

      if (fetchError) {
        setError(userFriendlyError(fetchError.message))
        setLoading(false)
        return
      }

      if (data && data.length > 0) {
        const restored: TimerEntry[] = data.map((row) => {
          const startedAt = new Date(row.started_at)
          return {
            id: row.id,
            taskName: row.task_name,
            projectId: row.project_id,
            startedAt,
            elapsedSeconds: computeElapsed(startedAt),
            pendingStop: false,
            stoppedAt: null,
          }
        })
        setTimers(restored)
      }

      setLoading(false)
    }

    restore()
    return () => {
      cancelled = true
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  // --- Start/stop shared interval based on active timers ---
  useEffect(() => {
    const activeTimers = timers.filter((t) => !t.pendingStop)
    if (activeTimers.length > 0) {
      startInterval()
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [timers, startInterval])

  // --- Refresh elapsed on tab visibility ---
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setTimers((prev) =>
          prev.map((t) =>
            t.pendingStop
              ? t
              : { ...t, elapsedSeconds: computeElapsed(t.startedAt) }
          )
        )
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  // --- Start a new timer ---
  const startTimer = useCallback(async () => {
    if (pendingRef.current) return

    const trimmed = taskName.trim()
    if (!trimmed) {
      setError('Le nom de la tâche est requis')
      return
    }
    if (trimmed.length > MAX_TASK_NAME_LENGTH) {
      setError(`Le nom ne peut pas dépasser ${MAX_TASK_NAME_LENGTH} caractères`)
      return
    }
    if (!projectId) {
      setError('Veuillez sélectionner un projet')
      return
    }
    if (!userIdRef.current) {
      setError('Session expirée, veuillez vous reconnecter.')
      return
    }

    pendingRef.current = true
    setError(null)
    const now = new Date()

    try {
      const { data, error: insertError } = await supabase
        .from('active_timers')
        .insert({
          task_name: trimmed,
          started_at: now.toISOString(),
          user_id: userIdRef.current,
          project_id: projectId,
        })
        .select('id')
        .single()

      if (insertError || !data) {
        setError(userFriendlyError(insertError?.message ?? 'Insert failed'))
        return
      }

      const newTimer: TimerEntry = {
        id: data.id,
        taskName: trimmed,
        projectId,
        startedAt: now,
        elapsedSeconds: 0,
        pendingStop: false,
        stoppedAt: null,
      }

      setTimers((prev) => [...prev, newTimer])
      setTaskName('')
    } finally {
      pendingRef.current = false
    }
  }, [taskName, projectId])

  // --- Stop a specific timer (show rating modal) ---
  const stopTimer = useCallback((timerId: string) => {
    setTimers((prev) => {
      if (prev.some((t) => t.pendingStop)) return prev
      return prev.map((t) =>
        t.id === timerId
          ? { ...t, pendingStop: true, stoppedAt: new Date(), elapsedSeconds: computeElapsed(t.startedAt) }
          : t
      )
    })
  }, [])

  // --- Confirm stop (finalize with optional rating) ---
  const confirmStop = useCallback(async (timerId: string, rating: number | null = null) => {
    if (pendingRef.current) return

    const timer = timers.find((t) => t.id === timerId)
    if (!timer || !timer.stoppedAt) return

    if (!isValidRating(rating)) {
      setError('Note invalide (1-5)')
      return
    }

    pendingRef.current = true
    setError(null)

    const durationMinutes = Math.round(
      (timer.stoppedAt.getTime() - timer.startedAt.getTime()) / 60000
    )

    try {
      const { error: rpcError } = await supabase.rpc('complete_timer', {
        p_timer_id: timer.id,
        p_task_name: timer.taskName,
        p_started_at: timer.startedAt.toISOString(),
        p_ended_at: timer.stoppedAt.toISOString(),
        p_duration_minutes: durationMinutes,
        p_project_id: timer.projectId,
        p_rating: rating,
      })

      if (rpcError) {
        setError(userFriendlyError(rpcError.message))
        return
      }

      setTimers((prev) => {
        const updated = prev.filter((t) => t.id !== timerId)
        stopIntervalIfEmpty(updated)
        return updated
      })
    } finally {
      pendingRef.current = false
    }
  }, [timers, stopIntervalIfEmpty])

  // --- Cancel stop (resume timer) ---
  const cancelStop = useCallback((timerId: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === timerId
          ? { ...t, pendingStop: false, stoppedAt: null, elapsedSeconds: computeElapsed(t.startedAt) }
          : t
      )
    )
  }, [])

  return {
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
  }
}
