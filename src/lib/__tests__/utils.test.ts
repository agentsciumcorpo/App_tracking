import { describe, it, expect } from 'vitest'
import { formatTime } from '../utils'

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
