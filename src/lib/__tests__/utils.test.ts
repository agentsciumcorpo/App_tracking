import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatTime, formatDate, isToday, isThisWeek, getWeekRange } from '../utils'

describe('formatTime', () => {
  it('formats zero', () => {
    expect(formatTime(0)).toBe('00:00:00')
  })

  it('formats seconds only', () => {
    expect(formatTime(45)).toBe('00:00:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(754)).toBe('00:12:34')
  })

  it('formats hours', () => {
    expect(formatTime(3661)).toBe('01:01:01')
  })

  it('clamps negative to zero', () => {
    expect(formatTime(-10)).toBe('00:00:00')
  })

  it('floors non-integer', () => {
    expect(formatTime(3.9)).toBe('00:00:03')
  })

  it('handles NaN', () => {
    expect(formatTime(NaN)).toBe('00:00:00')
  })

  it('handles Infinity', () => {
    expect(formatTime(Infinity)).toBe('00:00:00')
  })

  it('formats large values (100+ hours)', () => {
    expect(formatTime(360000)).toBe('100:00:00')
  })
})

describe('formatDate', () => {
  it('formats ISO string to DD/MM/YYYY HH:MM', () => {
    expect(formatDate('2026-03-15T14:30:00Z')).toMatch(/15\/03\/2026/)
  })

  it('pads single-digit day and month', () => {
    expect(formatDate('2026-01-05T09:05:00Z')).toMatch(/05\/01\/2026/)
  })
})

describe('isToday', () => {
  afterEach(() => vi.useRealTimers())

  it('returns true for today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-21T12:00:00Z'))
    expect(isToday('2026-03-21T08:00:00Z')).toBe(true)
  })

  it('returns false for yesterday', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-21T12:00:00Z'))
    expect(isToday('2026-03-20T23:59:00Z')).toBe(false)
  })
})

describe('isThisWeek', () => {
  afterEach(() => vi.useRealTimers())

  it('returns true for a day in the current week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-21T12:00:00Z')) // Saturday
    expect(isThisWeek('2026-03-16T10:00:00Z')).toBe(true) // Monday same week
  })

  it('returns false for last week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-21T12:00:00Z'))
    expect(isThisWeek('2026-03-15T10:00:00Z')).toBe(false) // Sunday prior week
  })
})

describe('getWeekRange', () => {
  afterEach(() => vi.useRealTimers())

  it('returns current week range with offset 0', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-21T12:00:00Z')) // Saturday
    const { weekStart, weekEnd, label } = getWeekRange(0)
    expect(weekStart).toBe('2026-03-16') // Monday
    expect(weekEnd).toBe('2026-03-22') // Sunday
    expect(label).toBe('Cette semaine')
  })

  it('returns previous week range with offset -1', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-21T12:00:00Z'))
    const { weekStart, weekEnd } = getWeekRange(-1)
    expect(weekStart).toBe('2026-03-09')
    expect(weekEnd).toBe('2026-03-15')
  })

  it('label for past weeks includes the date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-21T12:00:00Z'))
    const { label } = getWeekRange(-1)
    expect(label).toContain('Semaine du')
  })
})
