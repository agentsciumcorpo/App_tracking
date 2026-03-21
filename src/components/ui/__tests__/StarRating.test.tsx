import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StarRating } from '../StarRating'

describe('StarRating', () => {
  it('renders 5 stars', () => {
    render(<StarRating value={null} onChange={vi.fn()} />)
    const stars = screen.getAllByRole('radio')
    expect(stars).toHaveLength(5)
  })

  it('highlights stars up to selected value', () => {
    render(<StarRating value={3} onChange={vi.fn()} />)
    const stars = screen.getAllByRole('radio')
    expect(stars[0]).toHaveClass('text-yellow-400')
    expect(stars[2]).toHaveClass('text-yellow-400')
    expect(stars[3]).toHaveClass('text-zinc-600')
  })

  it('calls onChange with correct value on click', async () => {
    const onChange = vi.fn()
    render(<StarRating value={null} onChange={onChange} />)
    await userEvent.click(screen.getByLabelText('3 étoiles'))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('allows changing selection', async () => {
    const onChange = vi.fn()
    render(<StarRating value={2} onChange={onChange} />)
    await userEvent.click(screen.getByLabelText('5 étoiles'))
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('marks selected star as aria-checked', () => {
    render(<StarRating value={4} onChange={vi.fn()} />)
    expect(screen.getByLabelText('4 étoiles')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByLabelText('3 étoiles')).toHaveAttribute('aria-checked', 'false')
  })
})
