import { memo } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'

interface AnalysisPanelProps {
  content: string | null
  loading: boolean
  error: string | null
}

export const AnalysisPanel = memo(function AnalysisPanel({ content, loading, error }: AnalysisPanelProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-6 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-emerald-400" />
        <p className="text-sm text-zinc-400">Analyse en cours...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-6 py-12 text-zinc-500">
        <p className="text-lg">Pas encore d'analyse</p>
        <p className="text-sm">Cliquez sur le bouton pour générer votre analyse hebdomadaire.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-6 py-6">
      <MarkdownRenderer content={content} />
    </div>
  )
})
