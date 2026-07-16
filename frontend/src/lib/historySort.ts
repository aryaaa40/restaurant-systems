import type { HistoryEntry } from '../types/seating'

export type SortColumn =
  | 'table_code'
  | 'party_name'
  | 'party_size'
  | 'seated_at'
  | 'completed_at'
  | 'duration_minutes'
export type SortDirection = 'asc' | 'desc'

export interface SortCriterion {
  column: SortColumn
  direction: SortDirection
}

export function compareValues(a: HistoryEntry, b: HistoryEntry, column: SortColumn): number {
  const aValue = a[column]
  const bValue = b[column]

  if (aValue === null) return 1
  if (bValue === null) return -1

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue
  }

  return String(aValue).localeCompare(String(bValue))
}

export function compareByCriteria(
  a: HistoryEntry,
  b: HistoryEntry,
  criteria: SortCriterion[],
): number {
  for (const { column, direction } of criteria) {
    const result = compareValues(a, b, column)
    if (result !== 0) {
      return direction === 'asc' ? result : -result
    }
  }
  return 0
}
