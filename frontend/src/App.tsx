import { useState } from 'react'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { isAxiosError } from 'axios'
import { toast, Toaster } from 'sonner'
import { TableGrid } from './components/TableGrid'
import { Status } from './components/Status'
import { ArrivalForm } from './components/ArrivalForm'
import { QueueList } from './components/QueueList'
import { useAssign } from './hooks/useAssign'
import type { TableColor } from './lib/tableStatus'
import { HistoryTable } from './components/HistoryTable'

function App() {
  const [statusFilter, setStatusFilter] = useState<TableColor | null>(null)
  const assignMutation = useAssign()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const partyId = active.data.current?.partyId as number | undefined
    const partyName = active.data.current?.name as string | undefined
    const partySize = active.data.current?.size as number | undefined
    const tableId = over.data.current?.tableId as number | undefined
    const tableCode = over.data.current?.code as string | undefined
    const capacity = over.data.current?.capacity as number | undefined
    const isOccupied = over.data.current?.isOccupied as boolean | undefined


    if (!partyId || !tableId) return

    if (isOccupied) {
      toast.error('Meja sedang terisi, tidak bisa ditempati.')
      return
    }

    if (partySize !== undefined && capacity !== undefined && partySize > capacity) {
      toast.error(`Rombongan ${partySize} orang tidak muat di meja berkapasitas ${capacity}.`)
      return
    }

    assignMutation.mutate(
      { party_id: partyId, table_id: tableId },
      {
        onSuccess: () => {
          toast.success(`${partyName ?? 'Tamu'} berhasil ditempatkan di Meja ${tableCode ?? ''}.`)
        },
        onError: (error) => {
          const message =
            isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : 'Gagal menempatkan tamu ke meja.'
          toast.error(message)
        },
      },
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="min-h-screen bg-slate-50 p-6 md:p-10">
        <Toaster richColors position="top-right" />
        <div className="max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Restaurant Queue Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Pantau status meja, antrean, dan riwayat secara real-time.
            </p>
          </header>

          <Status activeFilter={statusFilter} onFilterChange={setStatusFilter} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              <TableGrid statusFilter={statusFilter} />
              <HistoryTable />
            </div>
            <div className="flex flex-col gap-6">
              <ArrivalForm />
              <QueueList />
            </div>
          </div>
        </div>
      </main>
    </DndContext>
  )
}

export default App
