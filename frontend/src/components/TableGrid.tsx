import { useStatus } from '../hooks/useStatus'
import { TableCard } from './TableCard'
import { getTableColor, type TableColor } from '../lib/tableStatus'

interface TableGridProps {
  statusFilter: TableColor | null
}

export function TableGrid({ statusFilter }: TableGridProps) {
  const { data, isLoading, isError } = useStatus()

  if (isLoading) {
    return <p className="text-slate-400 text-sm">Memuat status meja…</p>
  }

  if (isError || !data) {
    return <p className="text-rose-500 text-sm">Gagal memuat status meja.</p>
  }

  const tables = statusFilter
    ? data.tables.filter((table) => getTableColor(table, Date.now()) === statusFilter)
    : data.tables

  if (tables.length === 0) {
    return <p className="text-slate-400 text-sm">Tidak ada meja dengan status ini.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  )
}
