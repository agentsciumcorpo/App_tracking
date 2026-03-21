import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from '../TimerDisplay'

describe('TimerDisplay', () => {
  it('renders formatted time', () => {
    render(<TimerDisplay elapsedSeconds={3661} isRunning={false} />)
    expect(screen.getByText('01:01:01')).toBeInTheDocument()
  })

  it('shows 00:00:00 when not running', () => {
    render(<TimerDisplay elapsedSeconds={0} isRunning={false} />)
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
  })

  it('shows "En cours" label when running', () => {
    render(<TimerDisplay elapsedSeconds={10} isRunning={true} />)
    expect(screen.getByText('En cours')).toBeInTheDocument()
  })

  it('hides "En cours" label when not running', () => {
    render(<TimerDisplay elapsedSeconds={10} isRunning={false} />)
    expect(screen.queryByText('En cours')).not.toBeInTheDocument()
  })
})
