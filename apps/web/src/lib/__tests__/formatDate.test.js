import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDate, daysLeft, getStatus, formatNumber } from '../formatDate'

describe('formatDate utilities', () => {
  describe('formatDate', () => {
    it('formats a standard date string into Indian readable format', () => {
      expect(formatDate('2024-06-24')).toBe('24 Jun 2024')
    })

    it('handles null gracefully', () => {
      expect(formatDate(null)).toBeNull()
    })

    it('handles invalid dates by returning the raw string', () => {
      expect(formatDate('not-a-date')).toBe('not-a-date')
    })
  })

  describe('daysLeft', () => {
    beforeEach(() => {
      // Mock system time to June 17, 2024
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-17T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('calculates days remaining correctly', () => {
      // 17th to 24th is 7 days
      expect(daysLeft('2024-06-24')).toBe(7)
    })

    it('returns negative when date has passed', () => {
      expect(daysLeft('2024-06-10')).toBe(-7)
    })
    
    it('returns 0 when date is today', () => {
      expect(daysLeft('2024-06-17')).toBe(0)
    })
  })

  describe('getStatus', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-06-17T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns "open" if currently between start and end dates', () => {
      expect(getStatus('2024-06-01', '2024-06-30')).toBe('open')
    })

    it('returns "closed" if past end date', () => {
      expect(getStatus('2024-06-01', '2024-06-15')).toBe('closed')
    })

    it('returns "upcoming" if before start date', () => {
      expect(getStatus('2024-07-01', '2024-07-30')).toBe('upcoming')
    })
    
    it('returns "open" if only end date is provided and is in future', () => {
      expect(getStatus(null, '2024-06-30')).toBe('open')
    })
  })

  describe('formatNumber', () => {
    it('adds commas according to Indian numbering system', () => {
      expect(formatNumber(17727)).toBe('17,727')
      expect(formatNumber(1500000)).toBe('15,00,000')
    })

    it('handles null gracefully', () => {
      expect(formatNumber(null)).toBeNull()
    })
  })
})
