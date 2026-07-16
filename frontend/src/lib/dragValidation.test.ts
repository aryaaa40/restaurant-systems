import { describe, it, expect } from 'vitest'
import { validateDrop } from './dragValidation'

describe('validateDrop', () => {
  it('rejects dropping onto an occupied table', () => {
    const result = validateDrop(2, 4, true)
    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/sedang terisi/)
  })

  it('rejects a party larger than the table capacity', () => {
    const result = validateDrop(6, 4, false)
    expect(result.valid).toBe(false)
    expect(result.reason).toMatch(/tidak muat/)
  })

  it('accepts a party that fits an available table', () => {
    const result = validateDrop(3, 4, false)
    expect(result.valid).toBe(true)
    expect(result.reason).toBeUndefined()
  })
})
