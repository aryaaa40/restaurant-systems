import type { TableStatus } from '../types/seating'
import { useDateNow } from '../hooks/useDateNow'
import { useServe } from '../hooks/useServe'
import { getTableColor, STATUS_STYLES, formatCountdown } from '../lib/tableStatus'
import { Users } from 'lucide-react'

interface TableCardProps {
  table: TableStatus
}

export function TableCard({ table }: TableCardProps) {
  const now = useDateNow()
  const color = getTableColor(table, now)
  const styles = STATUS_STYLES[color]
  const serveMutation = useServe()

  return (
    <div
      data-testid={`table-${table.code}`}
      className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${styles.card} shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col gap-3 min-h-[180px]`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-bold text-slate-900">Meja {table.code}</h3>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
          <Users className="w-3.5 h-3.5" />
          {table.capacity}
        </span>
      </div>

      <span
        className={`inline-flex items-center gap-1.5 self-start text-xs font-semibold px-2.5 py-1 rounded-full ${styles.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        {styles.label}
      </span>

      {table.seating ? (
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-sm text-slate-600">
            {table.seating.party.name} · {table.seating.party.size} orang
          </p>
          <p className="text-3xl font-mono font-bold tracking-tight text-slate-900">
            {formatCountdown(table.seating.estimated_end_at, now)}
          </p>
          <button
            onClick={() => serveMutation.mutate({ table_id: table.id })}
            disabled={serveMutation.isPending}
            className="mt-2 w-full rounded-xl bg-slate-900 text-white text-sm font-medium py-2.5 hover:bg-slate-800 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {serveMutation.isPending ? 'Memproses…' : 'Force Complete'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-400 mt-auto">Belum ada tamu</p>
      )}
    </div>
  )
}
