import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RatingModal } from '../RatingModal'

describe('RatingModal', () => {
  it('renders modal with title and buttons', () => {
    render(<RatingModal onSubmit={vi.fn()} />)
    expect(screen.getByText('Comment était votre productivité ?')).toBeInTheDocument()
    expect(screen.getByText('Enregistrer')).toBeInTheDocument()
    expect(screen.getByText('Passer')).toBeInTheDocument()
  })

  it('disables Enregistrer when no rating selected', () => {
    render(<RatingModal onSubmit={vi.fn()} />)
    expect(screen.getByText('Enregistrer')).toBeDisabled()
  })

  it('enables Enregistrer after selecting a rating', async () => {
    render(<RatingModal onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('4 étoiles'))
    expect(screen.getByText('Enregistrer')).toBeEnabled()
  })

  it('calls onSubmit with rating when Enregistrer clicked', async () => {
    const onSubmit = vi.fn()
    render(<RatingModal onSubmit={onSubmit} />)
    await userEvent.click(screen.getByLabelText('3 étoiles'))
    await userEvent.click(screen.getByText('Enregistrer'))
    expect(onSubmit).toHaveBeenCalledWith(3)
  })

  it('calls onSubmit with null when Passer clicked', async () => {
    const onSubmit = vi.fn()
    render(<RatingModal onSubmit={onSubmit} />)
    await userEvent.click(screen.getByText('Passer'))
    expect(onSubmit).toHaveBeenCalledWith(null)
  })
})
