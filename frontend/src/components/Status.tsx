import { useStatus } from '../hooks/useStatus'
import { getTableColor, STATUS_STYLES, type TableColor } from '../lib/tableStatus'

const STATUS_ORDER: TableColor[] = ['green', 'red', 'yellow', 'blue']

interface StatusProps {
  activeFilter: TableColor | null
  onFilterChange: (color: TableColor | null) => void
}

export function Status({ activeFilter, onFilterChange }: StatusProps) {
  const { data } = useStatus()

  const counts = STATUS_ORDER.reduce<Record<TableColor, number>>(
    (acc, color) => {
      acc[color] =
        data?.tables.filter((table) => getTableColor(table, Date.now()) === color).length ?? 0
      return acc
    },
    { green: 0, red: 0, yellow: 0, blue: 0 },
  )

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {STATUS_ORDER.map((color) => {
        const styles = STATUS_STYLES[color]
        const isActive = activeFilter === color

        return (
          <button
            key={color}
            type="button"
            onClick={() => onFilterChange(isActive ? null : color)}
            className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition ${styles.badge} ${
              isActive ? `ring-2 ring-offset-1 ${styles.ring}` : 'hover:brightness-95'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
            {styles.label}
            <span className="font-semibold">({counts[color]})</span>
          </button>
        )
      })}
    </div>
  )
}
