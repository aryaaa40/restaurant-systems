import { Search } from 'lucide-react'
import { useStatus } from '../hooks/useStatus'

interface SearchFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  sizeFilter: number | null
  onSizeFilterChange: (value: number | null) => void
}

export function SearchFilterBar({
  search,
  onSearchChange,
  sizeFilter,
  onSizeFilterChange,
}: SearchFilterBarProps) {
  const { data } = useStatus()
  const maxCapacity = data?.tables.length
    ? Math.max(...data.tables.map((table) => table.capacity))
    : 8
  const sizeOptions = Array.from({ length: maxCapacity }, (_, i) => i + 1)

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex flex-col gap-1 w-44">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cth: Budi"
            className="w-full border border-slate-300 rounded-lg pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <select
          id="filter-size"
          value={sizeFilter ?? ''}
          onChange={(e) => onSizeFilterChange(e.target.value ? Number(e.target.value) : null)}
          className="border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="">Semua</option>
          {sizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} orang
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
