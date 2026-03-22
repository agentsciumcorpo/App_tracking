import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnalysisPanel } from '../AnalysisPanel'

describe('AnalysisPanel', () => {
  it('shows loading spinner when loading', () => {
    render(<AnalysisPanel content={null} loading={true} error={null} />)
    expect(screen.getByText('Analyse en cours...')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<AnalysisPanel content={null} loading={false} error="Aucune tâche cette semaine." />)
    expect(screen.getByText('Aucune tâche cette semaine.')).toBeInTheDocument()
  })

  it('shows empty state when no content', () => {
    render(<AnalysisPanel content={null} loading={false} error={null} />)
    expect(screen.getByText("Pas encore d'analyse")).toBeInTheDocument()
  })

  it('renders markdown content', () => {
    render(<AnalysisPanel content={"## Résumé\n\nVoici votre analyse."} loading={false} error={null} />)
    expect(screen.getByRole('heading', { name: 'Résumé' })).toBeInTheDocument()
    expect(screen.getByText('Voici votre analyse.')).toBeInTheDocument()
  })
})
