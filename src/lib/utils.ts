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

export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function isToday(isoString: string): boolean {
  const d = new Date(isoString)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

export function isThisWeek(isoString: string): boolean {
  const d = new Date(isoString)
  const now = new Date()
  const startOfWeek = new Date(now)
  const day = now.getDay()
  const diff = day === 0 ? 6 : day - 1
  startOfWeek.setDate(now.getDate() - diff)
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)
  return d >= startOfWeek && d < endOfWeek
}

export function getWeekRange(offset = 0): { weekStart: string; weekEnd: string; label: string } {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? 6 : day - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - diffToMonday + offset * 7)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const label = offset === 0 ? 'Cette semaine' : `Semaine du ${formatDate(monday.toISOString()).split(' ')[0]}`

  return { weekStart: fmt(monday), weekEnd: fmt(sunday), label }
}

export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '00:00:00'
  const safe = Math.floor(totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':')
}
