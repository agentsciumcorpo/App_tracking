import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { mapSupabaseError } from '../lib/errors'
import type { WeeklyAnalysis } from '../types'

export interface UseAnalysesReturn {
  analyses: WeeklyAnalysis[]
  currentAnalysis: WeeklyAnalysis | null
  loading: boolean
  generating: boolean
  error: string | null
  generate: (weekStart: string, weekEnd: string) => Promise<void>
  selectAnalysis: (analysis: WeeklyAnalysis) => void
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function useAnalyses(): UseAnalysesReturn {
  const [analyses, setAnalyses] = useState<WeeklyAnalysis[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<WeeklyAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastGenerateRef = useRef(0)

  const fetchAnalyses = useCallback(async (): Promise<WeeklyAnalysis[]> => {
    const { data, error: fetchError } = await supabase
      .from('weekly_analyses')
      .select('id, user_id, week_start, week_end, created_at')
      .order('week_start', { ascending: false })

    if (fetchError) {
      setError(mapSupabaseError('useAnalyses', fetchError.message))
      return []
    }

    const rows = (data ?? []) as WeeklyAnalysis[]
    setAnalyses(rows)
    return rows
  }, [])

  useEffect(() => {
    fetchAnalyses().finally(() => setLoading(false))
  }, [fetchAnalyses])

  const generate = useCallback(async (weekStart: string, weekEnd: string) => {
    if (!ISO_DATE_RE.test(weekStart) || !ISO_DATE_RE.test(weekEnd)) {
      setError('Dates invalides.')
      return
    }
    if (weekStart >= weekEnd) {
      setError('La date de début doit précéder la date de fin.')
      return
    }

    const now = Date.now()
    if (now - lastGenerateRef.current < 30000) {
      setError('Veuillez patienter 30 secondes entre deux analyses.')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setError('Session expirée, veuillez vous reconnecter.')
        return
      }

      const res = await supabase.functions.invoke('analyze-week', {
        body: { week_start: weekStart, week_end: weekEnd },
      })

      if (res.error) {
        const msg = res.error.message
        setError(msg.includes('Aucune tâche') ? 'Aucune tâche cette semaine.' : mapSupabaseError('useAnalyses', msg))
        return
      }

      lastGenerateRef.current = Date.now()
      const result = res.data as { content: string; week_start: string; week_end: string }

      const freshAnalyses = await fetchAnalyses()
      const found = freshAnalyses.find((a) => a.week_start === weekStart)

      if (found) {
        setCurrentAnalysis({ ...found, content: result.content })
      } else {
        setCurrentAnalysis({
          id: '',
          user_id: user.id,
          week_start: weekStart,
          week_end: weekEnd,
          content: result.content,
          created_at: new Date().toISOString(),
        })
      }
    } catch {
      setError('Erreur de connexion au serveur.')
    } finally {
      setGenerating(false)
    }
  }, [fetchAnalyses])

  const selectAnalysis = useCallback(async (analysis: WeeklyAnalysis) => {
    setError(null)
    if (analysis.content) {
      setCurrentAnalysis(analysis)
      return
    }

    const { data } = await supabase
      .from('weekly_analyses')
      .select('content')
      .eq('id', analysis.id)
      .single()

    setCurrentAnalysis({ ...analysis, content: data?.content ?? '' })
  }, [])

  return { analyses, currentAnalysis, loading, generating, error, generate, selectAnalysis }
}
