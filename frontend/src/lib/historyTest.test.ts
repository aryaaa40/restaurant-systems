import { describe, it, expect } from 'vitest'
import { compareByCriteria } from './historySort'
import type { HistoryEntry } from '../types/seating'

function buildEntry(overrides: Partial<HistoryEntry>): HistoryEntry {
  return {
    id: 1,
    table_code: 'A',
    party_name: 'Budi',
    party_size: 2,
    seated_at: '2026-07-16T10:00:00.000000Z',
    completed_at: '2026-07-16T10:40:00.000000Z',
    duration_minutes: 40,
    ...overrides,
  }
}

describe('compareByCriteria', () => {
  it('sorts by a single column ascending', () => {
    const a = buildEntry({ id: 1, duration_minutes: 50 })
    const b = buildEntry({ id: 2, duration_minutes: 20 })

    const result = compareByCriteria(a, b, [{ column: 'duration_minutes', direction: 'asc' }])

    expect(result).toBeGreaterThan(0)
  })

  it('reverses order when direction is descending', () => {
    const a = buildEntry({ id: 1, duration_minutes: 50 })
    const b = buildEntry({ id: 2, duration_minutes: 20 })

    const result = compareByCriteria(a, b, [{ column: 'duration_minutes', direction: 'desc' }])

    expect(result).toBeLessThan(0)
  })

  it('breaks ties using the second criterion', () => {
    const a = buildEntry({ id: 1, table_code: 'A', duration_minutes: 50 })
    const b = buildEntry({ id: 2, table_code: 'A', duration_minutes: 20 })

    const result = compareByCriteria(a, b, [
      { column: 'table_code', direction: 'asc' },
      { column: 'duration_minutes', direction: 'asc' },
    ])

    expect(result).toBeGreaterThan(0)
  })
})
