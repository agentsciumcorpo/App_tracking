import { memo, useState } from 'react'

interface StarRatingProps {
  value: number | null
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

const STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'

export const StarRating = memo(function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'md',
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const displayValue = (readOnly ? value : hovered ?? value) ?? 0

  if (readOnly) {
    return (
      <div className="flex gap-0.5" aria-label="Note de productivité">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${SIZES[size]} ${star <= displayValue ? 'text-yellow-400' : 'text-zinc-700'}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => setHovered(null)}
      role="radiogroup"
      aria-label="Note de productivité"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHovered(star)}
          className={`transition-colors ${SIZES[size]} ${
            star <= displayValue
              ? 'text-yellow-400'
              : 'text-zinc-600 hover:text-zinc-500'
          }`}
          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
          role="radio"
          aria-checked={value === star}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  )
})
