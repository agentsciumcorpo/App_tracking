import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ActiveTimer } from '../types'

export interface UseTimerReturn {
  taskName: string
  setTaskName: (name: string) => void
  isRunning: boolean
  elapsedSeconds: number
  startTimer: () => Promise<void>
  stopTimer: () => Promise<void>
  error: string | null
  loading: boolean
}

const MAX_TASK_NAME_LENGTH = 200

function userFriendlyError(raw: string): string {
  console.error('[useTimer]', raw)
  return 'Une erreur est survenue, veuillez réessayer.'
}

export function useTimer(): UseTimerReturn {
  const [taskName, setTaskName] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const userIdRef = useRef<string | null>(null)
  const pendingRef = useRef(false)
  const activeTaskNameRef = useRef('')

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

  // Restauration du timer au montage
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
        setStartedAt(start)
        setIsRunning(true)
        startInterval(start)
      }

      setLoading(false)
    }

    restore()
    return () => { cancelled = true; clearTimer() }
  }, [startInterval, clearTimer])

  // Rafraîchir le chrono au retour d'onglet
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
        })

      if (insertError) {
        setError(userFriendlyError(insertError.message))
        return
      }

      activeTaskNameRef.current = trimmed
      setStartedAt(now)
      setIsRunning(true)
      setElapsedSeconds(0)
      startInterval(now)
    } finally {
      pendingRef.current = false
    }
  }, [taskName, isRunning, startInterval])

  const stopTimer = useCallback(async () => {
    if (!startedAt || pendingRef.current) return

    if (!userIdRef.current) {
      setError('Session expirée, veuillez vous reconnecter.')
      return
    }

    pendingRef.current = true
    setError(null)
    const now = new Date()
    const durationMinutes = Math.round((now.getTime() - startedAt.getTime()) / 60000)

    try {
      const { error: rpcError } = await supabase.rpc('complete_timer', {
        p_user_id: userIdRef.current,
        p_task_name: activeTaskNameRef.current,
        p_started_at: startedAt.toISOString(),
        p_ended_at: now.toISOString(),
        p_duration_minutes: durationMinutes,
      })

      if (rpcError) {
        setError(userFriendlyError(rpcError.message))
        return
      }

      clearTimer()
      setIsRunning(false)
      setStartedAt(null)
      setElapsedSeconds(0)
      setTaskName('')
      activeTaskNameRef.current = ''
    } finally {
      pendingRef.current = false
    }
  }, [startedAt, clearTimer])

  return {
    taskName,
    setTaskName,
    isRunning,
    elapsedSeconds,
    startTimer,
    stopTimer,
    error,
    loading,
  }
}
