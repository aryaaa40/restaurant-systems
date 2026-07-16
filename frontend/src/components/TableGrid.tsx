import { useStatus } from '../hooks/useStatus'
import { TableCard } from './TableCard'

export function TableGrid() {
  const { data, isLoading, isError } = useStatus()

  if (isLoading) {
    return <p className="text-slate-400 text-sm">Memuat status meja…</p>
  }

  if (isError || !data) {
    return <p className="text-rose-500 text-sm">Gagal memuat status meja.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}
    </div>
  )
}
