import { STATUS_STYLES } from '../lib/tableStatus'

const STATUS_ORDER = ['green', 'red', 'yellow', 'blue'] as const

export function Status() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
      {STATUS_ORDER.map((color) => {
        const styles = STATUS_STYLES[color]
        return (
          <div key={color} className="flex items-center gap-2 text-sm text-slate-600">
            <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
            <span>{styles.label}</span>
          </div>
        )
      })}
    </div>
  )
}
