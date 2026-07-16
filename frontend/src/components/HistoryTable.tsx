import { useMemo, useState, type MouseEvent } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, X, Info } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import type { HistoryEntry } from '../types/seating'

type SortColumn =
  | 'table_code'
  | 'party_name'
  | 'party_size'
  | 'seated_at'
  | 'completed_at'
  | 'duration_minutes'
type SortDirection = 'asc' | 'desc'

interface SortCriterion {
  column: SortColumn
  direction: SortDirection
}

const COLUMNS: { key: SortColumn; label: string }[] = [
  { key: 'table_code', label: 'Meja' },
  { key: 'party_name', label: 'Nama Tamu' },
  { key: 'party_size', label: 'Jumlah Orang' },
  { key: 'seated_at', label: 'Mulai Duduk' },
  { key: 'completed_at', label: 'Selesai' },
  { key: 'duration_minutes', label: 'Durasi (menit)' },
]

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function compareValues(a: HistoryEntry, b: HistoryEntry, column: SortColumn): number {
  const aValue = a[column]
  const bValue = b[column]

  if (aValue === null) return 1
  if (bValue === null) return -1

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue
  }

  return String(aValue).localeCompare(String(bValue))
}

function compareByCriteria(a: HistoryEntry, b: HistoryEntry, criteria: SortCriterion[]): number {
  for (const { column, direction } of criteria) {
    const result = compareValues(a, b, column)
    if (result !== 0) {
      return direction === 'asc' ? result : -result
    }
  }
  return 0
}

export function HistoryTable() {
  const { data, isLoading, isError } = useHistory()
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>([
    { column: 'completed_at', direction: 'desc' },
  ])

  const history = data?.history ?? []

  const sortedHistory = useMemo(() => {
    const copy = [...history]
    copy.sort((a, b) => compareByCriteria(a, b, sortCriteria))
    return copy
  }, [history, sortCriteria])

  const handleHeaderClick = (column: SortColumn, event: MouseEvent) => {
    setSortCriteria((prev) => {
      const existingIndex = prev.findIndex((c) => c.column === column)

      if (event.shiftKey) {
        if (existingIndex === -1) {
          return [...prev, { column, direction: 'asc' }]
        }
        return prev.map((c, i) =>
          i === existingIndex
            ? { ...c, direction: c.direction === 'asc' ? 'desc' : 'asc' }
            : c,
        )
      }

      if (prev.length === 1 && prev[0].column === column) {
        return [{ column, direction: prev[0].direction === 'asc' ? 'desc' : 'asc' }]
      }
      return [{ column, direction: 'asc' }]
    })
  }

  if (isLoading) {
    return <p className="text-slate-400 text-sm">Memuat riwayat…</p>
  }

  if (isError) {
    return <p className="text-rose-500 text-sm">Gagal memuat riwayat.</p>
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 overflow-x-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">History Aktifitas Meja</h2>
        {sortCriteria.length > 1 && (
          <button
            type="button"
            onClick={() => setSortCriteria([{ column: 'completed_at', direction: 'desc' }])}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700"
          >
            <X className="w-3 h-3" />
            Reset sort
          </button>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Berikut adalah history aktifitas meja yang sudah selesai.
      </p>
      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-4">
        <Info className="w-3.5 h-3.5" />
        Klik header untuk urutkan · Shift+Klik untuk tambah kriteria sort
      </div>

      {sortedHistory.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Belum ada riwayat</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              {COLUMNS.map((column) => {
                const criterionIndex = sortCriteria.findIndex((c) => c.column === column.key)
                const criterion = criterionIndex !== -1 ? sortCriteria[criterionIndex] : undefined

                return (
                  <th
                    key={column.key}
                    onClick={(event) => handleHeaderClick(column.key, event)}
                    className="text-left py-2 px-2 font-semibold text-slate-600 cursor-pointer select-none hover:text-slate-900 whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1">
                      {column.label}
                      {criterion ? (
                        <>
                          {criterion.direction === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                          {sortCriteria.length > 1 && (
                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                              {criterionIndex + 1}
                            </span>
                          )}
                        </>
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((entry) => (
              <tr key={entry.id} className="border-b border-slate-100 last:border-0">
                <td className="py-2 px-2 font-medium text-slate-900">{entry.table_code}</td>
                <td className="py-2 px-2 text-slate-600">{entry.party_name}</td>
                <td className="py-2 px-2 text-slate-600">{entry.party_size}</td>
                <td className="py-2 px-2 text-slate-600 whitespace-nowrap">
                  {formatDateTime(entry.seated_at)}
                </td>
                <td className="py-2 px-2 text-slate-600 whitespace-nowrap">
                  {formatDateTime(entry.completed_at)}
                </td>
                <td className="py-2 px-2 text-slate-600">{entry.duration_minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
