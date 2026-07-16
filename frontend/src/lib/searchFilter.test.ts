import { describe, it, expect } from 'vitest'
import { matchesSearchFilter } from './searchFilter'

describe('matchesSearchFilter', () => {
  it('shows an empty table (no party) when no filter is active', () => {
    expect(matchesSearchFilter(undefined, '', null)).toBe(true)
  })

  it('hides an empty table once a search or size filter is active', () => {
    expect(matchesSearchFilter(undefined, 'Budi', null)).toBe(false)
    expect(matchesSearchFilter(undefined, '', 2)).toBe(false)
  })

  it('matches a party by case-insensitive partial name', () => {
    expect(matchesSearchFilter({ name: 'Budi Santoso', size: 2 }, 'budi', null)).toBe(true)
    expect(matchesSearchFilter({ name: 'Budi Santoso', size: 2 }, 'citra', null)).toBe(false)
  })

  it('matches a party by exact size', () => {
    expect(matchesSearchFilter({ name: 'Budi', size: 4 }, '', 4)).toBe(true)
    expect(matchesSearchFilter({ name: 'Budi', size: 4 }, '', 2)).toBe(false)
  })

  it('requires both name and size to match when both filters are active', () => {
    expect(matchesSearchFilter({ name: 'Budi', size: 4 }, 'budi', 4)).toBe(true)
    expect(matchesSearchFilter({ name: 'Budi', size: 4 }, 'budi', 2)).toBe(false)
  })
})
