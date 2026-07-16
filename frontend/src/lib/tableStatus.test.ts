import { describe, it, expect } from 'vitest'
import { getTableColor, formatCountdown } from './tableStatus'
import type { TableStatus } from '../types/seating'

function buildTable(overrides: Partial<TableStatus> = {}): TableStatus {
  return {
    id: 1,
    code: 'A',
    capacity: 4,
    status: 'available',
    seating: null,
    ...overrides,
  }
}

describe('getTableColor', () => {
  it('returns green for an available table', () => {
    const table = buildTable({ status: 'available', seating: null })
    expect(getTableColor(table, Date.now())).toBe('green')
  })

  it('returns red when more than 5 minutes remain', () => {
    const now = Date.now()
    const table = buildTable({
      status: 'occupied',
      seating: {
        party: { id: 1, name: 'Budi', size: 2 },
        seated_at: new Date(now).toISOString(),
        estimated_end_at: new Date(now + 10 * 60 * 1000).toISOString(),
        duration_minutes: 10,
      },
    })
    expect(getTableColor(table, now)).toBe('red')
  })

  it('returns yellow when 5 minutes or less remain', () => {
    const now = Date.now()
    const table = buildTable({
      status: 'occupied',
      seating: {
        party: { id: 1, name: 'Budi', size: 2 },
        seated_at: new Date(now).toISOString(),
        estimated_end_at: new Date(now + 3 * 60 * 1000).toISOString(),
        duration_minutes: 3,
      },
    })
    expect(getTableColor(table, now)).toBe('yellow')
  })

  it('returns blue when the estimated end time has already passed', () => {
    const now = Date.now()
    const table = buildTable({
      status: 'occupied',
      seating: {
        party: { id: 1, name: 'Budi', size: 2 },
        seated_at: new Date(now - 20 * 60 * 1000).toISOString(),
        estimated_end_at: new Date(now - 1000).toISOString(),
        duration_minutes: 19,
      },
    })
    expect(getTableColor(table, now)).toBe('blue')
  })
})

describe('formatCountdown', () => {
  it('formats remaining time as mm:ss', () => {
    const now = Date.now()
    const estimatedEndAt = new Date(now + 125 * 1000).toISOString()
    expect(formatCountdown(estimatedEndAt, now)).toBe('2:05')
  })

  it('prefixes with a minus sign when overdue', () => {
    const now = Date.now()
    const estimatedEndAt = new Date(now - 65 * 1000).toISOString()
    expect(formatCountdown(estimatedEndAt, now)).toBe('-1:05')
  })
})
