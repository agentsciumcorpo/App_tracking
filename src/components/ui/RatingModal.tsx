import { useState, memo, useEffect, useCallback } from 'react'
import { StarRating } from './StarRating'

interface RatingModalProps {
  onSubmit: (rating: number | null) => void
  onCancel?: () => void
  taskName?: string
}

export const RatingModal = memo(function RatingModal({ onSubmit, onCancel, taskName }: RatingModalProps) {
  const [rating, setRating] = useState<number | null>(null)

  const handleSkip = useCallback(() => onSubmit(null), [onSubmit])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onCancel) {
          onCancel()
        } else {
          handleSkip()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handleSkip, onCancel])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (onCancel) {
        onCancel()
      } else {
        handleSkip()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col items-center gap-6 rounded-xl border border-zinc-700 bg-zinc-800 px-8 py-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-zinc-100">
          Comment était votre productivité ?
        </h2>
        {taskName && (
          <p className="text-sm text-zinc-400 truncate max-w-xs">{taskName}</p>
        )}
        <StarRating value={rating} onChange={setRating} size="lg" />
        <div className="flex gap-3">
          <button
            onClick={() => onSubmit(rating)}
            disabled={rating === null}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enregistrer
          </button>
          <button
            onClick={handleSkip}
            className="rounded-lg bg-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-600"
          >
            Passer
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-lg bg-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-600"
            >
              Reprendre
            </button>
          )}
        </div>
      </div>
    </div>
  )
})
