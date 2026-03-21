import type { ProjectColor } from '../types'

export const PROJECT_COLORS: Record<ProjectColor, { bg: string; text: string; ring: string }> = {
  blue:   { bg: 'bg-blue-500',   text: 'text-blue-400',   ring: 'ring-blue-500/30' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', ring: 'ring-purple-500/30' },
  pink:   { bg: 'bg-pink-500',   text: 'text-pink-400',   ring: 'ring-pink-500/30' },
  red:    { bg: 'bg-red-500',    text: 'text-red-400',    ring: 'ring-red-500/30' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', ring: 'ring-orange-500/30' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', ring: 'ring-yellow-500/30' },
  green:  { bg: 'bg-green-500',  text: 'text-green-400',  ring: 'ring-green-500/30' },
  teal:   { bg: 'bg-teal-500',   text: 'text-teal-400',   ring: 'ring-teal-500/30' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-400', ring: 'ring-indigo-500/30' },
  gray:   { bg: 'bg-gray-500',   text: 'text-gray-400',   ring: 'ring-gray-500/30' },
}

export const PROJECT_COLOR_LIST: ProjectColor[] = Object.keys(PROJECT_COLORS) as ProjectColor[]

export function logError(...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console.error(...args)
  }
}

export function isValidRating(rating: number | null): boolean {
  return rating === null || (Number.isInteger(rating) && rating >= 1 && rating <= 5)
}

export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '00:00:00'
  const safe = Math.floor(totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':')
}
