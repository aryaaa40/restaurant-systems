import type { TableStatus } from '../types/seating'

export type TableColor = 'green' | 'yellow' | 'red' | 'blue'

const NEARING_COMPLETION_MS = 5 * 60 * 1000

export function getTableColor(table: TableStatus, now: number): TableColor {
  if (table.status === 'available' || !table.seating) {
    return 'green'
  }

  const endsAt = new Date(table.seating.estimated_end_at).getTime()
  const remainingMs = endsAt - now

  if (remainingMs < 0) {
    return 'blue'
  }

  if (remainingMs <= NEARING_COMPLETION_MS) {
    return 'yellow'
  }

  return 'red'
}

export const STATUS_STYLES: Record<
  TableColor,
  { card: string; dot: string; badge: string; label: string }
> = {
  green: {
    card: 'border-l-emerald-500',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
    label: 'Kosong',
  },
  red: {
    card: 'border-l-rose-500',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
    label: 'Terisi',
  },
  yellow: {
    card: 'border-l-amber-500',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700',
    label: 'Segera Selesai',
  },
  blue: {
    card: 'border-l-blue-500',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700',
    label: 'Overdue',
  },
}

export function formatCountdown(estimatedEndAt: string, now: number): string {
  const endsAt = new Date(estimatedEndAt).getTime()
  const diffMs = endsAt - now
  const isOverdue = diffMs < 0
  const totalSeconds = Math.floor(Math.abs(diffMs) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return isOverdue ? `-${formatted}` : formatted
}
