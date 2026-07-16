export function matchesSearchFilter(
  party: { name: string; size: number } | undefined,
  search: string,
  sizeFilter: number | null,
): boolean {
  const hasActiveFilter = search.trim() !== '' || sizeFilter !== null

  if (!party) {
    return !hasActiveFilter
  }

  const matchesName =
    search.trim() === '' || party.name.toLowerCase().includes(search.trim().toLowerCase())
  const matchesSize = sizeFilter === null || party.size === sizeFilter

  return matchesName && matchesSize
}
