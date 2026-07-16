import { useStatus } from '../hooks/useStatus'
import { useDateNow } from '../hooks/useDateNow'

function formatWaitingSince(arrivedAt: string, now: number): string {
  const arrivedMs = new Date(arrivedAt).getTime()
  const totalSeconds = Math.max(0, Math.floor((now - arrivedMs) / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function QueueList() {
  const { data } = useStatus()
  const now = useDateNow()

  const queue = data?.queue ?? []

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Antrean</h2>
      <p className="text-xs text-slate-500 mb-4">
        Urutan priority: rombongan terbesar didahulukan.
      </p>

      {queue.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Tidak ada yang menunggu</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {queue.map((party, index) => (
            <li
              key={party.id}
              className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">{party.name}</p>
                  <p className="text-xs text-slate-500">{party.size} orang</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {formatWaitingSince(party.arrived_at, now)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
