import { useState, useMemo } from 'react'
import { useAnalyses } from '../hooks/useAnalyses'
import { WeekSelector } from '../components/analysis/WeekSelector'
import { AnalysisPanel } from '../components/analysis/AnalysisPanel'
import { PastAnalysesList } from '../components/analysis/PastAnalysesList'
import { getWeekRange } from '../lib/utils'

export function AnalysisPage() {
  const { analyses, currentAnalysis, loading, generating, error, generate, selectAnalysis } = useAnalyses()
  const [weekIndex, setWeekIndex] = useState(0)

  const today = new Date().toISOString().split('T')[0]
  const weekOptions = useMemo(() => [
    getWeekRange(0),
    getWeekRange(-1),
  ].map((w) => ({ label: w.label, weekStart: w.weekStart, weekEnd: w.weekEnd })), [today])

  const selectedWeek = weekOptions[weekIndex]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 bg-zinc-900 px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-100">Analyse IA</h1>

      <div className="flex flex-wrap items-center gap-4">
        <WeekSelector options={weekOptions} selectedIndex={weekIndex} onChange={setWeekIndex} />
        <button
          onClick={() => generate(selectedWeek.weekStart, selectedWeek.weekEnd)}
          disabled={generating}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          {generating ? 'Analyse en cours...' : 'Analyser cette semaine'}
        </button>
      </div>

      <AnalysisPanel
        content={currentAnalysis?.content ?? null}
        loading={generating}
        error={error}
      />

      <PastAnalysesList
        analyses={analyses}
        currentId={currentAnalysis?.id ?? null}
        onSelect={selectAnalysis}
      />
    </div>
  )
}
