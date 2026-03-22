import { memo } from 'react'
import type { WeeklyAnalysis } from '../../types'
import { formatDate } from '../../lib/utils'

interface PastAnalysesListProps {
  analyses: WeeklyAnalysis[]
  currentId: string | null
  onSelect: (analysis: WeeklyAnalysis) => void
}

export const PastAnalysesList = memo(function PastAnalysesList({
  analyses,
  currentId,
  onSelect,
}: PastAnalysesListProps) {
  if (analyses.length === 0) {
    return (
      <p className="text-sm text-zinc-500">Aucune analyse sauvegardée.</p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-zinc-200">Analyses passées</h2>
      <ul className="flex flex-col gap-1">
        {analyses.map((a) => (
          <li key={a.id || a.week_start}>
            <button
              onClick={() => onSelect(a)}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                currentId === a.id
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200'
              }`}
            >
              <span className="font-medium">Semaine du {a.week_start}</span>
              <span className="ml-2 text-xs text-zinc-500">
                {formatDate(a.created_at)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
})
