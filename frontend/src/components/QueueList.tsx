import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useStatus } from '../hooks/useStatus'
import { useDateNow } from '../hooks/useDateNow'
import type { QueuedParty } from '../types/seating'
import { matchesSearchFilter } from '../lib/searchFilter'


function formatWaitingSince(arrivedAt: string, now: number): string {
  const arrivedMs = new Date(arrivedAt).getTime()
  const totalSeconds = Math.max(0, Math.floor((now - arrivedMs) / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

interface QueueItemProps {
  party: QueuedParty
  rank: number
  now: number
}

interface QueueListProps {
  search: string
  sizeFilter: number | null
}

function QueueItem({ party, rank, now }: QueueItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `party-${party.id}`,
    data: { partyId: party.id, size: party.size, name: party.name },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3 py-2.5 cursor-grab active:cursor-grabbing touch-none ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-slate-300" />
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
          {rank}
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
  )
}

export function QueueList({ search, sizeFilter }: QueueListProps) {
  const { data } = useStatus()
  const now = useDateNow()

  const fullQueue = data?.queue ?? []
  const filteredQueue = fullQueue
    .map((party, index) => ({ party, rank: index + 1 }))
    .filter(({ party }) => matchesSearchFilter(party, search, sizeFilter))

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Antrean</h2>
      <p className="text-xs text-slate-500 mb-4">
        Urut prioritas: rombongan terbesar didahulukan · seret ke meja untuk assign manual
      </p>

      {filteredQueue.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Tidak ada yang menunggu</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredQueue.map(({ party, rank }) => (
            <QueueItem key={party.id} party={party} rank={rank} now={now} />
          ))}
        </ul>
      )}
    </div>
  )
}

