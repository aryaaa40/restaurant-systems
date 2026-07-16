export interface DragValidationResult {
  valid: boolean
  reason?: string
}

export function validateDrop(
  partySize: number | undefined,
  tableCapacity: number | undefined,
  isTableOccupied: boolean | undefined,
): DragValidationResult {
  if (isTableOccupied) {
    return { valid: false, reason: 'Meja sedang terisi, tidak bisa ditempati.' }
  }

  if (partySize !== undefined && tableCapacity !== undefined && partySize > tableCapacity) {
    return {
      valid: false,
      reason: `Rombongan ${partySize} orang tidak muat di meja berkapasitas ${tableCapacity}.`,
    }
  }

  return { valid: true }
}
