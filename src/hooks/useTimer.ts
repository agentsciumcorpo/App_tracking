import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { logError } from '../lib/utils'
import type { ActiveTimer } from '../types'

export interface UseTimerReturn {
  taskName: string
  setTaskName: (name: string) => void
  projectId: string | null
  setProjectId: (id: string) => void
  isRunning: boolean
  pendingStop: boolean
  elapsedSeconds: number
  startTimer: () => Promise<void>
  stopTimer: () => void
  confirmStop: (rating?: number | null) => Promise<void>
  cancelStop: () => void
  error: string | null
  loading: boolean
}

const MAX_TASK_NAME_LENGTH = 200

function userFriendlyError(raw: string): string {
  logError('[useTimer]', raw)
  return 'Une erreur est survenue, veuillez réessayer.'
}

function isValidRating(rating: number | null): boolean {
  return rating === null || (Number.isInteger(rating) && rating >= 1 && rating <= 5)
}

export function useTimer(): UseTimerReturn {
  // --- Form state ---
  const [taskName, setTaskName] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)

  // --- Timer state ---
  const [isRunning, setIsRunning] = useState(false)
  const [pendingStop, setPendingStop] = useState(false)
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // --- Refs ---
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const userIdRef = useRef<string | null>(null)
  const pendingRef = useRef(false)
  const activeTaskNameRef = useRef('')
  const activeProjectIdRef = useRef<string | null>(null)
  const stoppedAtRef = useRef<Date | null>(null)

  // --- Interval management ---
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startInterval = useCallback((start: Date) => {
    clearTimer()
    const update = () => {
      const diff = Math.max(0, Math.floor((Date.now() - start.getTime()) / 1000))
      setElapsedSeconds(diff)
    }
    update()
    intervalRef.current = setInterval(update, 1000)
  }, [clearTimer])

  // --- Restore active timer on mount ---
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
        .single<ActiveTimer>()

      if (cancelled) return

      if (fetchError && fetchError.code !== 'PGRST116') {
        setError(userFriendlyError(fetchError.message))
      }

      if (data) {
        const start = new Date(data.started_at)
        setTaskName(data.task_name)
        activeTaskNameRef.current = data.task_name
        setProjectId(data.project_id)
        activeProjectIdRef.current = data.project_id
        setStartedAt(start)
        setIsRunning(true)
        startInterval(start)
      }

      setLoading(false)
    }

    restore()
    return () => { cancelled = true; clearTimer() }
  }, [startInterval, clearTimer])

  // --- Refresh elapsed on tab visibility ---
  useEffect(() => {
    if (!isRunning || !startedAt) return
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000)))
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [isRunning, startedAt])

  // --- Start ---
  const startTimer = useCallback(async () => {
    if (pendingRef.current || isRunning) return

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
      const { error: insertError } = await supabase
        .from('active_timers')
        .insert({
          task_name: trimmed,
          started_at: now.toISOString(),
          user_id: userIdRef.current,
          project_id: projectId,
        })

      if (insertError) {
        setError(userFriendlyError(insertError.message))
        return
      }

      activeTaskNameRef.current = trimmed
      activeProjectIdRef.current = projectId
      setStartedAt(now)
      setIsRunning(true)
      setElapsedSeconds(0)
      startInterval(now)
    } finally {
      pendingRef.current = false
    }
  }, [taskName, projectId, isRunning, startInterval])

  // --- Stop (visual only, shows rating modal) ---
  const stopTimer = useCallback(() => {
    if (!startedAt || pendingStop) return
    clearTimer()
    stoppedAtRef.current = new Date()
    setIsRunning(false)
    setPendingStop(true)
  }, [startedAt, pendingStop, clearTimer])

  // --- Confirm stop (finalize with optional rating) ---
  const confirmStop = useCallback(async (rating: number | null = null) => {
    if (!stoppedAtRef.current || !startedAt || pendingRef.current) return

    if (!isValidRating(rating)) {
      setError('Note invalide (1-5)')
      return
    }

    pendingRef.current = true
    setError(null)
    const now = stoppedAtRef.current
    const durationMinutes = Math.round((now.getTime() - startedAt.getTime()) / 60000)

    try {
      const { error: rpcError } = await supabase.rpc('complete_timer', {
        p_task_name: activeTaskNameRef.current,
        p_started_at: startedAt.toISOString(),
        p_ended_at: now.toISOString(),
        p_duration_minutes: durationMinutes,
        p_project_id: activeProjectIdRef.current,
        p_rating: rating,
      })

      if (rpcError) {
        setError(userFriendlyError(rpcError.message))
        return
      }

      setStartedAt(null)
      setElapsedSeconds(0)
      setTaskName('')
      activeTaskNameRef.current = ''
      setProjectId(null)
      activeProjectIdRef.current = null
      stoppedAtRef.current = null
      setPendingStop(false)
    } finally {
      pendingRef.current = false
    }
  }, [startedAt])

  // --- Cancel stop (resume timer) ---
  const cancelStop = useCallback(() => {
    if (!pendingStop || !startedAt) return
    stoppedAtRef.current = null
    setPendingStop(false)
    setIsRunning(true)
    startInterval(startedAt)
  }, [pendingStop, startedAt, startInterval])

  return {
    taskName,
    setTaskName,
    projectId,
    setProjectId,
    isRunning,
    pendingStop,
    elapsedSeconds,
    startTimer,
    stopTimer,
    confirmStop,
    cancelStop,
    error,
    loading,
  }
}
